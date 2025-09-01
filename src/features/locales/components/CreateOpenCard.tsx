import { LOCALE_REGEX } from "@/features/locales/constants";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

export default function CreateOpenCard({
  value,
  onChange,
  onOpen,
}: {
  value: string;
  onChange: (v: string) => void;
  onOpen: (locale: string) => void;
}) {
  const key = (value || "").trim().toLowerCase();
  const invalid = Boolean(value) && !LOCALE_REGEX.test(key);

  const submit = () => {
    if (!invalid && key) onOpen(key);
  };

  return (
    <Paper
      sx={{
        p: 2,
        alignSelf: "start",
        height: "fit-content",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Создать / открыть локаль
      </Typography>

      <Stack
        component="form"
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <TextField
          label="Локаль"
          placeholder="например: ua"
          size="small"
          value={value}
          error={invalid}
          helperText={invalid ? "Латиница 2–5 символов" : undefined}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: { xs: "100%", sm: 220 } }}
        />

        <Button
          type="submit"
          variant="contained"
          size="small" // ← высота как у TextField
          startIcon={<AddRoundedIcon />}
          disabled={!value || invalid}
        >
          Создать / Открыть
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
        После создания страница будет доступна по адресу{" "}
        <code>/{`{locale}`}</code>
      </Typography>
    </Paper>
  );
}
