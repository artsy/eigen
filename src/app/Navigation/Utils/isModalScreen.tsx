import { ModuleDescriptor } from "app/Navigation/routes"

export const isModalScreen = (module: ModuleDescriptor<any>) => {
  return !!module.options?.alwaysPresentModally
}
