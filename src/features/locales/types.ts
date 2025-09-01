/** Типы возможных блоков контента */
export type LocaleBlockType = "text" | "wallet";

/** Один блок локализованного контента */
export interface LocaleBlock {
  type: LocaleBlockType;
  content: string;
}

/** Контент страницы локали */
export interface LocaleContent {
  blocks: LocaleBlock[];
  textBeforeWallet?: string;
  wallet?: string;
  textAfterWallet?: string;
}

/** Ключ локали (например: "en", "ua", "pl") */
export type LocaleKey = string;

/** Мета-информация о локали */
export interface LocaleMeta {
  locale: LocaleKey;
  updatedAt: string;
}
