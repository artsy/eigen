export function nullToUndef<T>(value: T | null): T | undefined {
  return value ?? undefined
}
