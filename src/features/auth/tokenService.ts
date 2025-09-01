const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const token = {
  get access() {
    return localStorage.getItem(ACCESS);
  },
  get refresh() {
    return localStorage.getItem(REFRESH);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS, access);
    if (refresh) localStorage.setItem(REFRESH, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

export const logout = () => {
  token.clear();
  location.replace("/login");
};

export const isAuthed = () => Boolean(token.access);
