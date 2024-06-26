import { useEffect, useState } from "react";

import logger from "../logger";
// See: https://usehooks-ts.com/react-hook/use-event-listener
import { useEventListener } from "./useEventListener";

type Value<T> = T | undefined;

export function useReadLocalStorage<T>(key: string): Value<T> {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): Value<T> => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === "undefined") {
      return undefined;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : undefined;
    } catch (error) {
      logger.warn(`Error reading localStorage key “${key}”:`, error);
      return undefined;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<Value<T>>(readValue);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Listen if localStorage changes
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStorageChange = () => {
    setStoredValue(readValue());
  };

  // This only works for other documents, not the current one
  useEventListener("storage", handleStorageChange);

  // This is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener("local-storage", handleStorageChange);

  return storedValue;
}

export default useReadLocalStorage;
