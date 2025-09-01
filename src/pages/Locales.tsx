// src/pages/Locales.tsx
import { getLocaleContent, saveLocaleContent } from "@/features/locales/api";
import CreateOpenCard from "@/features/locales/components/CreateOpenCard";
import EditorCard from "@/features/locales/components/EditorCard";
import LocalesList from "@/features/locales/components/LocalesList";
import { useLocalesList } from "@/features/locales/hooks/useLocalesList";
import type { LocaleContent } from "@/features/locales/types";
import { Alert, Box, Snackbar } from "@mui/material";
import * as React from "react";

// та же regexp, что и в CreateOpenCard
const LOCALE_REGEX = /^[a-z]{2,5}$/;

export default function LocalesPage() {
  const { items, loading, error, reload, setError } = useLocalesList();

  // UI state
  const [createVal, setCreateVal] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [current, setCurrent] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<LocaleContent>({
    title: "",
    textBeforeWallet: "",
    wallet: "",
    textAfterWallet: "",
  });
  const [loadingEditor, setLoadingEditor] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const openEditor = async (loc: string) => {
    const key = (loc || "").trim().toLowerCase();
    if (!key) return;
    if (!LOCALE_REGEX.test(key)) {
      setError("Локаль — латиница 2–5 символов (например: ua, en)");
      return;
    }

    setCurrent(key);
    setLoadingEditor(true);
    try {
      const data = await getLocaleContent(key); // GET /api/admin/site-content/{locale}
      setForm(data);
    } catch (e: any) {
      setError(e?.message || "Не удалось открыть редактор");
      setForm({
        title: "",
        textBeforeWallet: "",
        wallet: "",
        textAfterWallet: "",
      });
    } finally {
      setLoadingEditor(false);
    }
  };

  const onSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const { created } = await saveLocaleContent(current, form); // PATCH или POST
      await reload();

      // если локаль только что СОЗДАНА — закрываем редактор и чистим поле создания
      if (created) {
        onClose();
        setCreateVal("");
      }
    } catch (e: any) {
      setError(e?.message || "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  const onClose = () => {
    setCurrent(null);
    setForm({
      title: "",
      textBeforeWallet: "",
      wallet: "",
      textAfterWallet: "",
    });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      }}
    >
      <CreateOpenCard
        value={createVal}
        onChange={setCreateVal}
        onOpen={openEditor}
      />

      <LocalesList
        items={items}
        loading={loading}
        query={query}
        onQuery={setQuery}
        onOpen={openEditor}
      />

      <EditorCard
        locale={current}
        value={form}
        onChange={setForm}
        loading={loadingEditor}
        saving={saving}
        onSave={onSave}
        onClose={onClose}
      />

      {/* ошибки */}
      {error && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
