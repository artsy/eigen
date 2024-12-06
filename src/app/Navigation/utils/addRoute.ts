import { ArtsyWebViewConfig, ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { AppModule, ViewOptions } from "app/Navigation/routes"
import { RouteMatcher } from "app/system/navigation/utils/RouteMatcher"
import { replaceParams } from "app/system/navigation/utils/replaceParams"
import { GraphQLTaggedNode } from "react-relay"

export const addRoute = (
  route: string,
  module: {
    name: AppModule
    Component: React.ComponentType<any>
    options?: ViewOptions
    Queries?: GraphQLTaggedNode[]
  },
  paramsMapper?: (val: any) => object
) => {
  return new RouteMatcher(route, module.name, paramsMapper)
}

export function addWebViewRoute(url: string, config?: ArtsyWebViewConfig) {
  return addRoute(
    url,
    {
      name: config?.alwaysPresentModally ? "ModalWebView" : "ReactWebView",
      Component: ArtsyWebViewPage,
      options: {
        alwaysPresentModally: config?.alwaysPresentModally,
        screenOptions: {
          gestureEnabled: false,
          headerShown: false,
        },
      },
    },
    (params) => ({
      url: replaceParams(url, params),
      isPresentedModally: !!config?.alwaysPresentModally,
      ...config,
    })
  )
}
