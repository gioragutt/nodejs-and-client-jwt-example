export const setStorage = (key: string, value: any) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};
