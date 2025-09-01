import { apiFetch } from "@/features/auth/apiFetch";
import { token } from "@/features/auth/tokenService";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import {
  AppBar,
  Box,
  Button, // ← добавь
  CircularProgress,
  CssBaseline,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 260;

export default function AppShell() {
  const mdUp = useMediaQuery("(min-width:900px)");
  const [open, setOpen] = React.useState(mdUp);
  React.useEffect(() => setOpen(mdUp), [mdUp]);

  const navigate = useNavigate();

  // ← состояние проверки и профиль
  const [checking, setChecking] = React.useState(true);
  const [me, setMe] = React.useState<{ email: string; name?: string } | null>(
    null
  );

  // ← проверяем /auth/me на старте (apiFetch сам делает рефреш и редирект при провале)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setChecking(true);
        const res = await apiFetch("/auth/me");
        if (!res.ok) throw new Error("me failed");
        const data = await res.json();
        if (!cancelled) setMe(data);
      } catch {
        // apiFetch уже очистит токены и отправит на /login
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    try {
      // опционально — если есть эндпоинт
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    token.clear();
    navigate("/login", { replace: true });
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Админ панель
        </Typography>
      </Toolbar>

      <List sx={{ flex: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/users"
            sx={{
              "&.active": { bgcolor: "action.selected" },
              mx: 1,
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <PeopleAltRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Пользователи" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/locales"
            sx={{
              "&.active": { bgcolor: "action.selected" },
              mx: 1,
              borderRadius: 1,
            }}
          >
            <ListItemIcon>
              <TranslateRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Локали" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutRoundedIcon />}
          onClick={logout}
        >
          Выйти
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            onClick={() => setOpen((v) => !v)}
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Админ панель
          </Typography>
          {/* можно показать имя/почту */}
          {me?.name || me?.email ? (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {me?.name ?? me?.email}
            </Typography>
          ) : null}
        </Toolbar>
        {checking && <LinearProgress />} {/* верхний индикатор */}
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={mdUp ? "persistent" : "temporary"}
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflowX: "hidden" }}
      >
        <Toolbar />
        {checking ? (
          <Box
            sx={{ display: "grid", placeItems: "center", minHeight: "40vh" }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
}
