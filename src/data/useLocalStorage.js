import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Restore Date objects for expenses
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (item.date && typeof item.date === 'string') {
              return { ...item, date: new Date(item.date) };
            }
            return item;
          });
        }
        return parsed;
      }
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch { /* quota exceeded — ignore */ }
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
