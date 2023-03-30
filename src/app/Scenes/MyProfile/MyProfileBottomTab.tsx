import { Flex } from "@artsy/palette-mobile"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import { MyProfileHeaderWrapper } from "app/Scenes/MyProfile/MyProfileHeader"
import React from "react"
import { Tabs } from "react-native-collapsible-tab-view"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saves",
  insights = "Insights",
}

export const MyProfile2: React.FC = () => {
  return (
    <Tabs.Container renderHeader={MyProfileHeaderWrapper} lazy initialTabName="Insights">
      <Tabs.Tab name={Tab.collection} label={Tab.collection}>
        <Flex flex={1} backgroundColor="red10" />
      </Tabs.Tab>
      <Tabs.Tab name={Tab.insights} label={Tab.insights}>
        <MyCollectionInsightsQR />
      </Tabs.Tab>
      <Tabs.Tab name={Tab.savedWorks} label={Tab.savedWorks}>
        <Flex flex={1} backgroundColor="blue10" />
      </Tabs.Tab>
    </Tabs.Container>
  )
}
