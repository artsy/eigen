import React from "react"
import { NativeModules } from "react-native"
import { Boot } from "./Boot"
import { ConsignmentsHomeQueryRenderer as ConsignmentsHome } from "./Screens/ConsignmentsHome"
import { MyCollectionHome } from "./Screens/MyCollectionHome"

export const SellTabLanding: React.FC = () => {
  const myCollectionEnabled = NativeModules.Emission.options?.AROptionsEnableMyCollection
  const SellTabHome = () => (myCollectionEnabled ? <MyCollectionHome /> : <ConsignmentsHome />)

  return (
    <Boot>
      <SellTabHome />
    </Boot>
  )
}
