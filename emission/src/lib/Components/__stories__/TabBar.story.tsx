import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ScrollView, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import TabBar, { Tab } from "../TabBar"

storiesOf("App Style/Tab Bar")
  .addDecorator(story => <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>{story()}</View>)
  .add("Fixed sized tabs and Centered", () => {
    return (
      <ScrollView>
        <View style={{ height: 200 }}>
          <ScrollableTabView renderTabBar={props => <TabBar tabAlignment="left" {...props} />}>
            <Tab tabLabel=" Artists">
              <View style={{ backgroundColor: "red", height: 200 }} />
            </Tab>
            <Tab tabLabel=" For you">
              <View style={{ backgroundColor: "green", height: 200 }} />
            </Tab>
            <Tab tabLabel=" Auctions">
              <View style={{ backgroundColor: "blue", height: 200 }} />
            </Tab>
          </ScrollableTabView>
        </View>

        <View style={{ height: 200 }}>
          <ScrollableTabView initialPage={2} renderTabBar={props => <TabBar {...props} />}>
            <Tab tabLabel="One">
              <View style={{ backgroundColor: "red", height: 200 }} />
            </Tab>
            <Tab tabLabel="Two">
              <View style={{ backgroundColor: "green", height: 200 }} />
            </Tab>
            <Tab tabLabel="Three">
              <View style={{ backgroundColor: "blue", height: 200 }} />
            </Tab>
            <Tab tabLabel="Four">
              <View style={{ backgroundColor: "yellow", height: 200 }} />
            </Tab>
            <Tab tabLabel="Five">
              <View style={{ backgroundColor: "orange", height: 200 }} />
            </Tab>
            <Tab tabLabel="Six">
              <View style={{ backgroundColor: "purple", height: 200 }} />
            </Tab>
            <Tab tabLabel="Seven">
              <View style={{ backgroundColor: "silver", height: 200 }} />
            </Tab>
          </ScrollableTabView>
        </View>
      </ScrollView>
    )
  })
