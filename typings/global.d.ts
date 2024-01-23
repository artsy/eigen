export {}

declare global {
  type Prettify<T> = { [K in keyof T]: T[K] } & {}
}
