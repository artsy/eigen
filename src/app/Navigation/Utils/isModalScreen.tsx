import { ModuleDescriptor } from "app/AppRegistry"

export const isModalScreen = (module: ModuleDescriptor) => {
  return !!module.options.alwaysPresentModally
}
