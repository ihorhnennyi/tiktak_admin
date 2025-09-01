import {
  blockAllVisits,
  blockByIp,
  fetchVisits,
  unblockAllVisits,
  unblockByIp,
} from "@/features/visits/api";
import VisitsFilters from "@/features/visits/components/VisitsFilters";
import VisitsTable from "@/features/visits/components/VisitsTable";
import {
  applyVisitsFilters,
  defaultVisitsFilters,
  type VisitsFilters as VF,
} from "@/features/visits/filters";
import type { Visit } from "@/features/visits/types";

import { Alert, Divider, Paper, Snackbar } from "@mui/material";
import * as React from "react";

import ActionsBar from "@/features/visits/components/ActionsBar";
import Confirm from "@/features/visits/components/Confirm";
import HeaderBar from "@/features/visits/components/HeaderBar";
import StatsPanel from "@/features/visits/components/StatsPanel";
import { downloadCSV } from "@/features/visits/utils";

export default function Users() {
  const [rows, setRows] = React.useState<Visit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<VF>(defaultVisitsFilters);

  const [auto, setAuto] = React.useState<boolean>(
    () => localStorage.getItem("visits:autoRefresh") === "1"
  );
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  const [confirm, setConfirm] = React.useState<null | "block" | "unblock">(
    null
  );
  const [confirmBusy, setConfirmBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVisits();
      setRows(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    localStorage.setItem("visits:autoRefresh", auto ? "1" : "0");
    if (!auto) return;
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [auto, load]);

  const doMassAction = async (kind: "block" | "unblock") => {
    setConfirmBusy(true);
    try {
      if (kind === "block") await blockAllVisits();
      else await unblockAllVisits();
      await load();
      setToast(
        kind === "block"
          ? "Все пользователи заблокированы"
          : "Все пользователи разблокированы"
      );
      setConfirm(null);
    } catch (e: any) {
      setError(e?.message || "Не удалось выполнить действие");
    } finally {
      setConfirmBusy(false);
    }
  };

  const handleToggleBlock = async (ip: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await blockByIp(ip);
      } else {
        await unblockByIp(ip);
      }

      // 🔁 Обновляем только нужную строку локально
      setRows((prev) =>
        prev.map((r) => (r.ip === ip ? { ...r, isBlocked } : r))
      );

      setToast(isBlocked ? `IP ${ip} заблокирован` : `IP ${ip} разблокирован`);
    } catch (e: any) {
      setError(e?.message || "Не удалось изменить блокировку");
    }
  };

  const filtered = React.useMemo(
    () => applyVisitsFilters(rows, filters),
    [rows, filters]
  );

  return (
    <Paper sx={{ p: { xs: 1.5, md: 2 }, overflowX: "hidden" }}>
      <HeaderBar
        title="Пользователи (визиты)"
        total={filtered.length}
        auto={auto}
        onToggleAuto={setAuto}
        loading={loading}
        onRefresh={load}
        onExport={() => downloadCSV(filtered, "visits.csv")}
        canExport={!!filtered.length}
      />

      <StatsPanel rows={filtered} />

      <ActionsBar
        loading={loading}
        onBlockAll={() => setConfirm("block")}
        onUnblockAll={() => setConfirm("unblock")}
        lastUpdated={lastUpdated}
      />

      <VisitsFilters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultVisitsFilters)}
      />

      <Divider sx={{ my: 1.5 }} />

      <VisitsTable
        rows={filtered}
        loading={loading}
        error={error}
        onToggleBlock={handleToggleBlock} // передаём сюда
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setToast(null)}
          variant="filled"
        >
          {toast}
        </Alert>
      </Snackbar>

      <Confirm
        open={confirm === "block"}
        title="Заблокировать всех?"
        text="Будут помечены как заблокированные все визиты, удовлетворяющие текущей выборке."
        onClose={() => setConfirm(null)}
        onConfirm={() => doMassAction("block")}
        loading={confirmBusy}
      />
      <Confirm
        open={confirm === "unblock"}
        title="Разблокировать всех?"
        text="Будут сняты блокировки со всех визитов в текущей выборке."
        onClose={() => setConfirm(null)}
        onConfirm={() => doMassAction("unblock")}
        loading={confirmBusy}
      />
    </Paper>
  );
}
