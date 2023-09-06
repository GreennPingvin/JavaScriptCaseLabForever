export function loadData<T>(key: string): T {
  return JSON.parse(localStorage.getItem(key));
}

export function saveData<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}
