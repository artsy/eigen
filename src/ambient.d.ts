// Exists in JS runtime, needed by relay
interface File {
  _?: boolean
}

// Exists in JS runtime *when running in a web inspector
interface Console {
  group(message: string): void
  groupCollapsed(message?: any, ...optionalParams: any[]): void
  groupEnd(): void
}

// Needed by styled components, normally comes from the DOM d.ts
interface StyleSheet {
  _?: boolean
}

interface Node {
  _?: boolean
}

declare module "" {
  global {
    const __TEST__: boolean
  }
}

type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : never

type DeepPartial<T extends object> = Partial<{
  [k in keyof T]: T[k] extends object ? DeepPartial<T[k]> : T[k]
}>

declare function assertNever(val: never): void
