export interface ReactNativeFileOptions {
  uri: string
  type?: string
  name?: string
}

export class ReactNativeFile {
  uri: string
  type?: string
  name?: string

  constructor({ uri, name, type }: ReactNativeFileOptions) {
    this.uri = uri
    this.name = name
    this.type = type
  }
}

export const isReactNativeFile = (value: any) => {
  return value instanceof ReactNativeFile
}
