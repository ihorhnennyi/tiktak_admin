import { PUBLIC_CLIENT_ORIGIN } from "@/config";
import type { LocaleMeta } from "@/features/locales/types";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

type Props = {
  items: LocaleMeta[];
  loading: boolean;
  query: string;
  onQuery: (v: string) => void;
  onOpen: (locale: string) => void;
  maxRows?: number; // можно передать другое ограничение, по умолчанию 3
};

export default function LocalesList({
  items,
  loading,
  query,
  onQuery,
  onOpen,
  maxRows = 3,
}: Props) {
  const filtered = React.useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => i.locale.toLowerCase().includes(s));
  }, [query, items]);

  // высота одной «dense» строки с разделителем (примерно)
  const ROW_H = 52;
  const needScroll = !loading && filtered.length > maxRows;

  return (
    <Paper
      sx={{
        p: 2,
        alignSelf: "start",
        height: "fit-content",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="h6">Существующие локали</Typography>
        <Chip
          size="small"
          color="primary"
          icon={<PublicRoundedIcon />}
          label={`Всего: ${items.length}`}
        />
      </Stack>

      <TextField
        size="small"
        placeholder="Поиск по локалям…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1 }}
      />

      <List
        dense
        sx={{
          maxHeight: needScroll ? ROW_H * maxRows : "none",
          overflowY: needScroll ? "auto" : "visible",
          pr: needScroll ? 0.5 : 0, // небольшой отступ, чтобы полоса прокрутки не перекрывала action-кнопки
        }}
      >
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 3 }}>
            <CircularProgress />
          </Stack>
        ) : filtered.length ? (
          filtered.map((i) => (
            <React.Fragment key={i.locale}>
              <ListItem
                disableGutters
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      edge="end"
                      component="a"
                      href={`${PUBLIC_CLIENT_ORIGIN}/${i.locale}`}
                      target="_blank"
                      rel="noopener"
                      title="Открыть страницу"
                    >
                      <OpenInNewRoundedIcon />
                    </IconButton>
                    <Button size="small" onClick={() => onOpen(i.locale)}>
                      Редактировать
                    </Button>
                  </Stack>
                }
              >
                <ListItemText
                  primary={i.locale}
                  secondary={
                    i.updatedAt
                      ? `Обновлено: ${new Date(i.updatedAt).toLocaleString()}`
                      : undefined
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 1, py: 2 }}
          >
            Нет результатов
          </Typography>
        )}
      </List>
    </Paper>
  );
}
