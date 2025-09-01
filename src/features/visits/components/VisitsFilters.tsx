import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import type { VisitsFilters } from "../filters";

type Props = {
  value: VisitsFilters;
  onChange: (v: VisitsFilters) => void;
  onReset: () => void;
};

export default function VisitsFilters({ value, onChange, onReset }: Props) {
  const set = <K extends keyof VisitsFilters>(k: K, v: VisitsFilters[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Box sx={{ mb: 1.5 }}>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
      >
        <TextField
          label="Поиск (IP, UA, referrer, IDs)"
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
        />

        <TextField
          label="Язык"
          value={value.lang}
          onChange={(e) => set("lang", e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        />

        <TextField
          label="Платформа"
          value={value.platform}
          onChange={(e) => set("platform", e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        />

        <TextField
          select
          label="Блок"
          value={value.blocked}
          onChange={(e) => set("blocked", e.target.value as any)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="any">Любой</MenuItem>
          <MenuItem value="yes">Да</MenuItem>
          <MenuItem value="no">Нет</MenuItem>
        </TextField>

        <TextField
          select
          label="Онлайн"
          value={value.online}
          onChange={(e) => set("online", e.target.value as any)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="any">Любой</MenuItem>
          <MenuItem value="yes">Да</MenuItem>
          <MenuItem value="no">Нет</MenuItem>
        </TextField>

        <TextField
          select
          label="HTTPS"
          value={value.secure}
          onChange={(e) => set("secure", e.target.value as any)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="any">Любой</MenuItem>
          <MenuItem value="yes">Да</MenuItem>
          <MenuItem value="no">Нет</MenuItem>
        </TextField>

        <TextField
          type="number"
          label="Визитов ≥"
          value={value.minVisits ?? ""}
          onChange={(e) =>
            set(
              "minVisits",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          size="small"
          sx={{ width: 120 }}
          inputProps={{ min: 0 }}
        />
        <TextField
          type="number"
          label="Визитов ≤"
          value={value.maxVisits ?? ""}
          onChange={(e) =>
            set(
              "maxVisits",
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          size="small"
          sx={{ width: 120 }}
          inputProps={{ min: 0 }}
        />

        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onReset} size="small" variant="outlined">
          Сбросить
        </Button>
      </Stack>
    </Box>
  );
}
