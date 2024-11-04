export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
) {
  let timer: null | ReturnType<typeof window.setTimeout> = null;
  return function (...args: Parameters<T>) {
    if (timer) {
      clearTimeout(delay);
    }
    timer = setTimeout(() => {
      func(...args);
    });
  };
}
