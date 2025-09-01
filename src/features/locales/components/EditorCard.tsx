import { copyToClipboard } from "@/features/locales/constants";
import type { LocaleContent } from "@/features/locales/types";
import Confirm from "@/features/visits/components/Confirm";

import { PUBLIC_CLIENT_ORIGIN } from "@/config";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";

type BlockType = "text" | "wallet";

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
  const [confirmClose, setConfirmClose] = React.useState(false);
  const [orig, setOrig] = React.useState<LocaleContent | null>(null);

  React.useEffect(() => {
    if (locale) setOrig(value);
  }, [locale]);

  const dirty = React.useMemo(() => {
    if (!orig) return false;
    return JSON.stringify(orig) !== JSON.stringify(value);
  }, [orig, value]);

  const link = locale ? `${PUBLIC_CLIENT_ORIGIN}/${locale}` : "";

  const doClose = () => {
    if (dirty) setConfirmClose(true);
    else onClose();
  };

  const handleBlockChange = (i: number, content: string) => {
    const blocks = [...(value.blocks || [])];
    blocks[i] = { ...blocks[i], content };
    onChange({ ...value, blocks });
  };

  const addBlock = (type: BlockType) => {
    onChange({
      ...value,
      blocks: [...(value.blocks || []), { type, content: "" }],
    });
  };

  const removeBlock = (i: number) => {
    const blocks = [...(value.blocks || [])];
    blocks.splice(i, 1);
    onChange({ ...value, blocks });
  };

  return (
    <Paper
      sx={{
        p: 2,
        gridColumn: { md: "1 / -1" },
        display: locale ? "block" : "none",
      }}
    >
      {/* Header */}
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

      {/* Body */}
      {loading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Box>
          <Stack spacing={2}>
            {(value.blocks || []).map((block, i) => (
              <Box key={i}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
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
                  onChange={(e) => handleBlockChange(i, e.target.value)}
                  helperText={`${block.content.length} символов`}
                />

                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Stack>

          {/* Добавление блоков */}
          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <Button onClick={() => addBlock("text")}>➕ ТЕКСТ</Button>
            <Button onClick={() => addBlock("wallet")}>➕ КОШЕЛЁК</Button>
          </Stack>
        </Box>
      )}

      {/* Confirm close */}
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
