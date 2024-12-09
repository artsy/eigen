import { ModuleDescriptor } from "app/Navigation/routes"

export const isModalScreen = (module: ModuleDescriptor) => {
  return !!module.options?.alwaysPresentModally
}
