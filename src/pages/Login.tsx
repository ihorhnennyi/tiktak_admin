import { login } from "@/features/auth/api";
import { token } from "@/features/auth/tokenService";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login({ email, password });
      token.set(data.accessToken, data.refreshToken);
      location.replace("/"); // RequireAuth пропустит
    } catch (e: any) {
      setError(e.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#fafafa" : "background.default",
        background:
          "radial-gradient(1000px 600px at -10% -10%, rgba(25,118,210,.15), transparent)," +
          "radial-gradient(1000px 600px at 110% 110%, rgba(156,39,176,.18), transparent)",
      }}
    >
      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{
          width: 420,
          maxWidth: "100%",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 12px 40px rgba(0,0,0,.12), 0 4px 14px rgba(0,0,0,.08)",
        }}
      >
        <Stack gap={2}>
          {loading && <LinearProgress sx={{ borderRadius: 1 }} />}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Вход
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Панель администратора
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Пароль"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPwd((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? "Входим…" : "Войти"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
