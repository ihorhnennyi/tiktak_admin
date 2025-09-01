import { Chip, Paper, Stack, Typography } from "@mui/material";

export default function StatChip({
  icon,
  label,
  value,
  color = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: "default" | "primary" | "success" | "warning" | "error" | "info";
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Chip
          icon={icon as any}
          label={label}
          size="small"
          color={color}
          variant="outlined"
        />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}
