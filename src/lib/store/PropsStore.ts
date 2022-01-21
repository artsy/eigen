class PropsStore {
  static _instance: PropsStore

  private propsByModuleName: Record<string, any> = {}
  private pendingPropsByModuleName: Record<string, any> = {}

  constructor() {
    if (PropsStore._instance) {
      return PropsStore._instance
    }
    PropsStore._instance = this
  }

  updateProps(
    moduleName: string,
    props: any,
    callback?: (updatedProps: { [key: string]: any }) => void
  ) {
    this.mergeNewPropsForModule(moduleName, props)
    callback?.(this.propsByModuleName[moduleName])
  }

  setPendingProps(moduleName: string, newProps: any) {
    this.pendingPropsByModuleName[moduleName] = newProps
  }

  getPropsForModule(moduleName: string) {
    if (this.pendingPropsByModuleName[moduleName]) {
      this.propsByModuleName[moduleName] = this.pendingPropsByModuleName[moduleName]
      delete this.pendingPropsByModuleName[moduleName]
    }
    return this.propsByModuleName[moduleName] || {}
  }

  mergeNewPropsForModule(moduleName: string, newProps: any) {
    const currentProps = this.getPropsForModule(moduleName)
    this.propsByModuleName[moduleName] = {
      ...currentProps,
      ...newProps,
    }
  }
}

export const propsStore = new PropsStore()
