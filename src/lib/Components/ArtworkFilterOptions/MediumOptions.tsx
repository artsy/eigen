import React from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface MediumOptionsScreenProps {
  navigator: NavigatorIOS
}

export const MediumOptionsScreen: React.SFC<MediumOptionsScreenProps> = ({ navigator }) => {
  return <SingleSelectOptionScreen filterType="medium" filterText="Medium" navigator={navigator} />
}
