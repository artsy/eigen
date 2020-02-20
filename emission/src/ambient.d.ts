// Exists in JS runtime, needed by relay
interface File {
  _?: boolean
}

// Exists in JS runtime *when running in a web inspector
interface Console {
  group(message: string)
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
