export function nullToUndef<T>(value: T | null): T | undefined {
  return value ?? undefined
}

export function undefToNull<T>(value: T | undefined): T | null {
  return value ?? null
}
