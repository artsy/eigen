import { requireNativeComponent } from "react-native"

const ARTCityGuideView = requireNativeComponent("ARTCityGuideView")

export const CityGuideView: React.FC = () => (
  <ARTCityGuideView // @ts-ignore
    style={{ flex: 1 }}
  />
)
