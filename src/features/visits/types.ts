export type Visit = {
  _id: string; // MongoDB ID, если приходит с сервера
  ip: string; // IP-адрес пользователя
  lastVisit: string | Date; // Последнее посещение
  visitsCount: number; // Сколько раз посещал
  isBlocked: boolean; // Заблокирован ли
  online: boolean; // Онлайн ли сейчас
  socketId: string; // Socket.IO ID
  pageId: string; // Страница, которую посещает
  createdAt: string; // Дата создания
  updatedAt: string; // Дата обновления

  // Данные устройства
  userAgent: string; // Полный User-Agent строки браузера
  lang: string; // Язык браузера (напр. "ru-RU")
  locale: string; // Локаль сайта (напр. "ua", "en", "ru")
  timezone: string; // Таймзона
  screen: string; // Разрешение экрана
  platform: string; // Платформа (например, "Win32")
  referrer: string; // Referrer страницы
  memory: number | string; // Объём оперативки
  cores: number; // Количество ядер процессора
  secure: boolean; // HTTPS или нет
  connectionType: string; // Тип подключения (wifi, cellular и т.д.)
  maxTouchPoints: number; // Количество касаний
  cookieEnabled: boolean; // Включены ли cookies
};
