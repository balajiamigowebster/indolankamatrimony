import { useState, useEffect } from "react";

/**
 * Debounces a value, ensuring that the value only updates after a specified delay
 * has passed without any new changes.
 * * @param {any} value - The value to debounce (e.g., search term from input).
 * @param {number} delay - The delay in milliseconds (e.g., 700ms).
 * @returns {any} The debounced value.
 */

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. New timeout set for updating the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Cleanup function: If the value changes (user types again)
    //    before the delay is up, the previous timer is cancelled (cleared).
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
