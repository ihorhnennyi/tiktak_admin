import type { Visit } from "@/features/visits/types";
import { getIP, isTrue } from "@/features/visits/utils";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import { Box } from "@mui/material";
import StatChip from "./StatChip";

export default function StatsPanel({ rows }: { rows: Visit[] }) {
  const total = rows.length;

  const uniqIPs = (() => {
    const s = new Set<string>();
    rows.forEach((v) => {
      const ip = getIP(v);
      if (ip) s.add(ip);
    });
    return s.size;
  })();

  const blocked = rows.reduce((acc: number, v: any) => {
    const b = v.block ?? v.blocked ?? v.isBlocked ?? v.ban ?? v.banned;
    return acc + (isTrue(b) ? 1 : 0);
  }, 0);

  const online = rows.reduce((acc: number, v: any) => {
    const o = v.online ?? v.isOnline;
    return acc + (isTrue(o) ? 1 : 0);
  }, 0);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 1.5,
        mb: 2,
      }}
    >
      <StatChip
        icon={<QueryStatsRoundedIcon />}
        label="Всего записей"
        value={total}
        color="primary"
      />
      <StatChip
        icon={<PublicRoundedIcon />}
        label="Уникальных IP"
        value={uniqIPs}
        color="info"
      />
      <StatChip
        icon={<GppBadRoundedIcon />}
        label="Заблокировано"
        value={blocked}
        color="warning"
      />
      <StatChip
        icon={<SensorsRoundedIcon />}
        label="Онлайн"
        value={online}
        color="success"
      />
    </Box>
  );
}
