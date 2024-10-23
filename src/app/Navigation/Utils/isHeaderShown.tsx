import { ModuleDescriptor } from "app/AppRegistry"

export const isHeaderShown = (module: ModuleDescriptor) => {
  return !module.options.hidesBackButton && !module.options.hasOwnModalCloseButton
}
