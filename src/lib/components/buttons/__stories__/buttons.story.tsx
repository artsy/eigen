import { action, storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"
import { View } from "react-native"

import { RootContainer } from "react-relay"
import StubContainer from "react-storybooks-relay-container"

import FlatWhite from "../flat_white"
import InvertedButton from "../inverted_button"
import NavigationButton from "../navigation_button"

const smallButton = { height: 26, width: 320, marginBottom: 20 }
const largeButton = { height: 26, width: 320, marginBottom: 20 }

storiesOf("Buttons")
  .addDecorator((story) => (
    <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>{story()}</View>
  ))
  .add("Flat White", () => {
    return [
      <FlatWhite text="Default" style={smallButton} />,
      <FlatWhite text="Clickable" style = {smallButton} onPress = {action("Pressed")} />,
    ]
  })
  .add("Inverted Button", () => {
    return [
      <View style={largeButton}>
        <InvertedButton text="Default" />
      </View>,
      <View style={largeButton}>
        <InvertedButton text="Clickable" onPress={action("Pressed")} />
      </View>,
       <View style={largeButton}>
        <InvertedButton text="In Progress..." inProgress={true} />
      </View>,
    ]
  })
  .add("Navigation Button", () => {
    return [
      <NavigationButton title="Default" href="/link/place" />,
    ]
  })
