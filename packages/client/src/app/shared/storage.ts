export const saveToStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
}

export const loadFromStorage = <T>(key: string): T => {
  const fromStorage = localStorage.getItem(key);
  return fromStorage ? JSON.parse(fromStorage) as T : null;
}