import type { Visit } from "@/features/visits/types";
import {
  Alert,
  CircularProgress,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

type Props = {
  rows: Visit[];
  onToggleBlock?: (ip: string, isBlocked: boolean) => void;
  loading?: boolean;
  error?: string | null;
};

const VisitsTable = ({ rows, onToggleBlock, loading, error }: Props) => {
  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </TableContainer>
    );
  }

  if (error) {
    return (
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>IP</TableCell>
            <TableCell>Socket</TableCell>
            <TableCell>Страница</TableCell>
            <TableCell>Локаль</TableCell>
            <TableCell>Онлайн</TableCell>
            <TableCell>Платформа</TableCell>
            <TableCell>Язык</TableCell>
            <TableCell>UA</TableCell>
            <TableCell>Referrer</TableCell>
            <TableCell>Экран</TableCell>
            <TableCell>RAM</TableCell>
            <TableCell>CPU</TableCell>
            <TableCell>Touch</TableCell>
            <TableCell>HTTPS</TableCell>
            <TableCell>Cookie</TableCell>
            <TableCell>Conn.</TableCell>
            <TableCell>Визитов</TableCell>
            <TableCell>Последний визит</TableCell>
            <TableCell>Создан</TableCell>
            <TableCell>Блок</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r._id}>
              <TableCell>{r.ip}</TableCell>
              <TableCell>{r.socketId}</TableCell>
              <TableCell>{r.pageId}</TableCell>
              <TableCell>{r.locale}</TableCell>
              <TableCell>{r.online ? "🟢" : "⚪️"}</TableCell>
              <TableCell>{r.platform}</TableCell>
              <TableCell>{r.lang}</TableCell>
              <TableCell>
                <Tooltip title={r.userAgent}>
                  <Typography noWrap maxWidth={140}>
                    {r.userAgent}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={r.referrer || ""}>
                  <Typography noWrap maxWidth={120}>
                    {r.referrer || "-"}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>{r.screen}</TableCell>
              <TableCell>{r.memory} GB</TableCell>
              <TableCell>{r.cores}</TableCell>
              <TableCell>{r.maxTouchPoints}</TableCell>
              <TableCell>{r.secure ? "✔️" : "❌"}</TableCell>
              <TableCell>{r.cookieEnabled ? "✔️" : "❌"}</TableCell>
              <TableCell>{r.connectionType}</TableCell>
              <TableCell>{r.visitsCount}</TableCell>
              <TableCell>
                {r.lastVisit
                  ? format(new Date(r.lastVisit), "dd.MM.yyyy HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                {r.createdAt
                  ? format(new Date(r.createdAt), "dd.MM.yyyy HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                <Tooltip
                  title={r.isBlocked ? "Разблокировать" : "Заблокировать"}
                >
                  <Switch
                    size="small"
                    checked={r.isBlocked}
                    onChange={() => onToggleBlock?.(r.ip, !r.isBlocked)}
                    color={r.isBlocked ? "error" : "primary"}
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VisitsTable;
