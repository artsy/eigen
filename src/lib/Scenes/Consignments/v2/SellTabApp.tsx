import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { NativeModules } from "react-native"
import { MyCollectionArtworkList } from "./Screens/ArtworkList/MyCollectionArtworkList"
import { ConsignmentsHomeQueryRenderer as ConsignmentsHome } from "./Screens/ConsignmentsHome/ConsignmentsHome"

// TODO: Rename to MyCollectionApp once launched

export const SellTabApp: React.FC = () => {
  const myCollectionEnabled = NativeModules.Emission.options?.AROptionsEnableMyCollection
  const SellTabHome = () => (myCollectionEnabled ? <MyCollectionArtworkList /> : <ConsignmentsHome />)

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Sell,
        context_screen_owner_type: null,
      }}
    >
      <SellTabHome />
    </ProvideScreenTracking>
  )
}
