import { LiveAuctionView } from "app/NativeModules/LiveAuctionView"
import { Providers } from "app/Providers"
import { AppRegistry, Platform } from "react-native"

function register(moduleName: string, Component: React.ComponentType<any>) {
  const WrappedComponent = (props: any) => (
    <Providers>
      <Component {...props} />
    </Providers>
  )
  AppRegistry.registerComponent(moduleName, () => WrappedComponent)
}

const modules: { moduleName: string; module: React.FC<any> }[] = [
  {
    moduleName: "LiveAuction",
    module: LiveAuctionView,
  },
]

if (Platform.OS === "ios") {
  modules.map(({ moduleName, module }) => {
    register(moduleName, module)
  })
}
