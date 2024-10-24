import { CityGuideView } from "app/NativeModules/CityGuideView"
import { LiveAuctionView } from "app/NativeModules/LiveAuctionView"
import { Providers } from "app/Providers"
import { CityView } from "app/Scenes/City/City"
import { CityPicker } from "app/Scenes/City/CityPicker"
import { MapContainer } from "app/Scenes/Map/MapContainer"
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
    moduleName: "LocalDiscovery",
    module: CityGuideView,
  },
  {
    moduleName: "LiveAuction",
    module: LiveAuctionView,
  },
  {
    moduleName: "CityPicker",
    module: CityPicker,
  },
  {
    moduleName: "Map",
    module: MapContainer,
  },
  {
    moduleName: "City",
    module: CityView as any,
  },
]

if (Platform.OS === "ios") {
  modules.map(({ moduleName, module }) => {
    register(moduleName, module)
  })
}
