import { internal_navigationRef } from "app/Navigation/Navigation"
import { AppModule } from "app/Navigation/routes"
import { getDomainMap } from "app/Navigation/utils/getDomainMap"
import { unsafe__getEnvironment } from "app/store/GlobalStore"

// Helper method that returns the current URL
export const getCurrentURL = () => {
  const moduleMap = getModuleMap()
  const moduleDescriptor = internal_navigationRef.current?.getCurrentRoute()?.params as any

  const { webURL } = unsafe__getEnvironment()

  const currentModuleName = moduleDescriptor?.moduleName as AppModule | undefined
  if (!currentModuleName) {
    return
  }

  const currentModuleProps = moduleDescriptor.props

  const currentModule = moduleMap[currentModuleName]

  let { route: path } = currentModule

  const queryParams = [] as { [key: string]: string }[]

  if (currentModuleProps) {
    Object.entries(currentModuleProps).map(([key, value]) => {
      if (path.includes(`:${key}`)) {
        path = path.replace(`:${key}`, value as string)
      } else {
        queryParams.push({ [key]: value as string })
      }
    })
  }

  const queryParamsString = queryParams.map((params) =>
    Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
  )

  return encodeURI(`${webURL}${path}?${queryParamsString}`)
}

type ModuleMap = {
  [key in AppModule]: {
    route: string
    params: string[]
  }
}

function getModuleMap(): ModuleMap {
  const domainMap = getDomainMap()
  const artsyDotNetRoutes = domainMap["artsy.net"]

  const moduleMap = {} as ModuleMap

  if (artsyDotNetRoutes) {
    artsyDotNetRoutes.forEach((moduleDescriptor) => {
      if (
        // Some routes have the same module name, so we need to check if it's already in the map
        // before adding it
        !moduleMap[moduleDescriptor["module"]] &&
        moduleDescriptor["module"] !== "ModalWebView" &&
        moduleDescriptor["module"] !== "ReactWebView"
      ) {
        moduleMap[moduleDescriptor["module"]] = {
          route: moduleDescriptor["route"],
          params: moduleDescriptor["parts"]
            .filter((part) => part.type === "variable")
            .map((part) => (part as any).name),
        }
      }
    })
  }

  return moduleMap
}
