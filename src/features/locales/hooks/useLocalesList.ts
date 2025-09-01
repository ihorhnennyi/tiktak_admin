import { listLocales } from "@/features/locales/api";
import type { LocaleMeta } from "@/features/locales/types";
import { useCallback, useEffect, useState } from "react";

/**
 * Хук для получения списка локалей (admin API)
 */
export function useLocalesList() {
  const [items, setItems] = useState<LocaleMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Загрузка списка локалей */
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listLocales();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Не удалось загрузить локали");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Автозагрузка при монтировании */
  useEffect(() => {
    reload();
  }, [reload]);

  return {
    items,
    loading,
    error,
    reload,
    setError, // может пригодиться для ручного сброса ошибок
  };
}
