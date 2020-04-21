import React from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

export const SortOptionsScreen: React.SFC<SortOptionsScreenProps> = ({ navigator }) => {
  return <SingleSelectOptionScreen filterType="sort" filterText="Sort" navigator={navigator} />
}
