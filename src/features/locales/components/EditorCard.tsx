import { copyToClipboard } from "@/features/locales/constants";
import type { LocaleContent } from "@/features/locales/types";
import Confirm from "@/features/visits/components/Confirm";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";

export default function EditorCard({
  locale,
  value,
  onChange,
  loading,
  saving,
  onSave,
  onClose,
}: {
  locale: string | null;
  value: LocaleContent;
  onChange: (v: LocaleContent) => void;
  loading: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const [toast, setToast] = React.useState<string | null>(null);
  const [confirmClose, setConfirmClose] = React.useState(false);
  const [orig, setOrig] = React.useState<LocaleContent | null>(null);

  React.useEffect(() => {
    if (locale) setOrig(value);
  }, [locale]);

  const dirty = React.useMemo(() => {
    if (!orig) return false;
    return JSON.stringify(orig) !== JSON.stringify(value);
  }, [orig, value]);

  const link = locale ? `/${locale}` : "";

  const doClose = () => {
    if (dirty) setConfirmClose(true);
    else onClose();
  };

  const handleBlockChange = (i: number, content: string) => {
    const newBlocks = [...(value.blocks || [])];
    newBlocks[i].content = content;
    onChange({ ...value, blocks: newBlocks });
  };

  const addBlock = (type: "text" | "wallet") => {
    onChange({
      ...value,
      blocks: [...(value.blocks || []), { type, content: "" }],
    });
  };

  const removeBlock = (i: number) => {
    const newBlocks = [...(value.blocks || [])];
    newBlocks.splice(i, 1);
    onChange({ ...value, blocks: newBlocks });
  };

  const insertAtCursor = (
    el: HTMLInputElement | HTMLTextAreaElement,
    text: string
  ) => {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value;
    const newValue = value.slice(0, start) + text + value.slice(end);
    el.value = newValue;
    el.setSelectionRange(start + text.length, start + text.length);
    el.focus();
    return newValue;
  };

  return (
    <Paper
      sx={{
        p: 2,
        gridColumn: { md: "1 / -1" },
        display: locale ? "block" : "none",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <span style={{ fontWeight: 600 }}>Редактор:</span>
          {locale && <Chip label={locale} color="secondary" size="small" />}
          {locale && (
            <>
              <Button
                variant="text"
                size="small"
                component="a"
                href={link}
                target="_blank"
                rel="noopener"
                startIcon={<OpenInNewRoundedIcon />}
              >
                Открыть страницу
              </Button>
              <Tooltip title="Скопировать ссылку">
                <IconButton size="small" onClick={() => copyToClipboard(link)}>
                  <ContentCopyRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<CloseRoundedIcon />}
            onClick={doClose}
            disabled={saving}
          >
            Закрыть
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={onSave}
            disabled={!locale || saving || !dirty}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Box>
          <Stack spacing={2}>
            {(value.blocks || []).map((block, i) => (
              <Box key={i}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">{block.type}</Typography>
                  <IconButton size="small" onClick={() => removeBlock(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <TextField
                  fullWidth
                  multiline={block.type === "text"}
                  label={block.type === "text" ? "Текст" : "Кошелёк"}
                  value={block.content}
                  inputProps={{ "data-block-index": i }}
                  onChange={(e) => handleBlockChange(i, e.target.value)}
                  helperText={`${block.content.length} символов`}
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={() => {
                          const input = document.querySelector(
                            `[data-block-index="${i}"]`
                          ) as HTMLInputElement | HTMLTextAreaElement;
                          if (!input) return;
                          const updated = insertAtCursor(input, "{{userIp}}");
                          handleBlockChange(i, updated);
                        }}
                      >
                        Вставить IP
                      </Button>
                    ),
                  }}
                />

                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={2} mt={2}>
            <Button onClick={() => addBlock("text")}>➕ Текст</Button>
            <Button onClick={() => addBlock("wallet")}>➕ Кошелёк</Button>
          </Stack>
        </Box>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToast(null)}
        >
          {toast}
        </Alert>
      </Snackbar>

      <Confirm
        open={confirmClose}
        title="Закрыть редактор?"
        text="У вас есть несохранённые изменения. Закрыть без сохранения?"
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
      />
    </Paper>
  );
}
