import { Flex } from "@artsy/palette-mobile"
import { MyProfileHeaderWrapper } from "app/Scenes/MyProfile/MyProfileHeader"
import React from "react"
import { Tabs } from "react-native-collapsible-tab-view"

export const MyProfile2: React.FC = () => {
  return (
    <Tabs.Container renderHeader={MyProfileHeaderWrapper}>
      <Tabs.Tab name="A">
        <Flex flex={1} backgroundColor="red10" />
      </Tabs.Tab>
      <Tabs.Tab name="B">
        <Flex flex={1} backgroundColor="brand" />
      </Tabs.Tab>
    </Tabs.Container>
  )
}
