import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

export default function HeaderBar({
  title,
  total,
  auto,
  onToggleAuto,
  loading,
  onRefresh,
  onExport,
  canExport,
}: {
  title: string;
  total: number;
  auto: boolean;
  onToggleAuto: (v: boolean) => void;
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  canExport: boolean;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 1 }}
    >
      <Typography variant="h5">
        {title}
        {total ? ` — ${total}` : ""}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <FormControlLabel
          control={
            <Switch
              checked={auto}
              onChange={(e) => onToggleAuto(e.target.checked)}
              disabled={loading}
            />
          }
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <TimerRoundedIcon fontSize="small" />
              <span>каждые 10s</span>
            </Stack>
          }
        />

        <Tooltip title="Обновить">
          <span>
            <Button
              variant="outlined"
              size="small"
              startIcon={
                loading ? (
                  <CircularProgress size={18} />
                ) : (
                  <RefreshRoundedIcon />
                )
              }
              onClick={onRefresh}
              disabled={loading}
            >
              Обновить
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Экспорт CSV (текущая выборка)">
          <span>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudDownloadRoundedIcon />}
              onClick={onExport}
              disabled={loading || !canExport}
            >
              Экспорт
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
