import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";

export default function ActionsBar({
  loading,
  onBlockAll,
  onUnblockAll,
  lastUpdated,
}: {
  loading: boolean;
  onBlockAll: () => void;
  onUnblockAll: () => void;
  lastUpdated: Date | null;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{ mb: 2 }}
    >
      <ButtonGroup variant="contained" disabled={loading}>
        <Button
          color="error"
          startIcon={<BlockRoundedIcon />}
          onClick={onBlockAll}
        >
          Заблокировать всех
        </Button>
        <Button
          color="success"
          startIcon={<CheckCircleRoundedIcon />}
          onClick={onUnblockAll}
        >
          Разблокировать всех
        </Button>
      </ButtonGroup>

      <Box sx={{ ml: { sm: "auto" }, opacity: 0.7 }}>
        {lastUpdated && (
          <Typography variant="body2">
            Обновлено: {lastUpdated.toLocaleTimeString()}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
