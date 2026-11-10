export {}

declare global {
  type Prettify<T> = { [K in keyof T]: T[K] } & {}

  /**
   * Subset of React Native's IntersectionObserver Web API, available when the native
   * `enableIntersectionObserverByDefault` flag is on. Undefined otherwise (and in Jest).
   */
  interface IntersectionObserverEntry {
    readonly isIntersecting: boolean
    readonly intersectionRatio: number
  }

  interface IntersectionObserver {
    observe(target: unknown): void
    unobserve(target: unknown): void
    disconnect(): void
  }

  // eslint-disable-next-line no-var
  var IntersectionObserver:
    | {
        new (
          callback: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
          options?: { threshold?: number | number[]; rootMargin?: string }
        ): IntersectionObserver
      }
    | undefined
}
