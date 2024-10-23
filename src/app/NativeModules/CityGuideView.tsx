import { requireNativeComponent } from "react-native"

const ARTMap = requireNativeComponent("ARTCityGuideView")

export const CityGuideView: React.FC = () => (
  <ARTMap // @ts-ignore
    style={{ flex: 1 }}
  />
)
