/** Регулярное выражение для проверки ключа локали (например: "en", "ua") */
export const LOCALE_REGEX: RegExp = /^[a-z]{2,5}$/;

/** Генерация ключа для локального хранения черновика */
export const draftKey = (locale: string): string => `locales:draft:${locale}`;

/** Копирует текст в буфер обмена (без ошибок в консоли) */
export function copyToClipboard(text: string): void {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
