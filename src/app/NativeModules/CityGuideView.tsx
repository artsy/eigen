import React from "react"
import { requireNativeComponent } from "react-native"

const ARTCityGuideView = requireNativeComponent("ARTCityGuideView")

export const CityGuideView: React.FC = () => {
  return (
    <ARTCityGuideView // @ts-ignore
      style={{ flex: 1 }}
    />
  )
}
