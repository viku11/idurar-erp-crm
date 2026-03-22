function isJsonString(str: string | null): boolean {
  try {
    JSON.parse(str as string);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return false;
  }
  return true;
}

export const localStorageHealthCheck = async (): Promise<void> => {
  for (let i = 0; i < localStorage.length; ++i) {
    try {
      const key: string | null = localStorage.key(i);
      if (key === null) {
        continue;
      }
      const result: string | null = window.localStorage.getItem(key);
      if (!isJsonString(result)) {
        window.localStorage.removeItem(key);
      }
      if (result && Object.keys(key).length == 0) {
        window.localStorage.removeItem(key);
      }
    } catch (error: unknown) {
      window.localStorage.clear();
      // Handle the exception here
      console.error('window.localStorage Exception occurred:', error);
      // You can choose to ignore certain exceptions or take other appropriate actions
    }
  }
};

interface StorePersist {
  set: (key: string, state: unknown) => void;
  get: (key: string) => unknown;
  remove: (key: string) => void;
  getAll: () => Storage;
  clear: () => void;
}

export const storePersist: StorePersist = {
  set: (key: string, state: unknown): void => {
    window.localStorage.setItem(key, JSON.stringify(state));
  },
  get: (key: string): unknown => {
    const result: string | null = window.localStorage.getItem(key);
    if (!result) {
      return false;
    } else {
      if (!isJsonString(result)) {
        window.localStorage.removeItem(key);
        return false;
      } else return JSON.parse(result);
    }
  },
  remove: (key: string): void => {
    window.localStorage.removeItem(key);
  },
  getAll: (): Storage => {
    return window.localStorage;
  },
  clear: (): void => {
    window.localStorage.clear();
  },
};

export default storePersist;
