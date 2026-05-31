/* ============================================
   useDebounce.js — Debounce Hook
   ============================================
   Delays updating a value until after a
   specified delay. Useful for search inputs.
   ============================================ */

import { useState, useEffect } from 'react';

/**
 * useDebounce — returns a debounced version of a value.
 *
 * Usage:
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 500);
 *   // Use debouncedSearch to trigger API calls
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timeout if value or delay changes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
