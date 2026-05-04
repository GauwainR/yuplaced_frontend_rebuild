import { useEffect, useRef } from 'react';

/**
 * Calls `callback` after `delay`ms of no new changes to `deps`.
 * Skips the very first render (mount) so initial data load doesn't
 * trigger an immediate save.
 */
export function useDebouncedSave(
  callback: () => void,
  delay: number,
  deps: unknown[],
): void {
  const isFirstRender = useRef(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip first render — we don't want to save mocks/loaded data immediately
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      callback();
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
