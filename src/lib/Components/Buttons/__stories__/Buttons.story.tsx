import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { GhostButton, GrayActionButton, InvertedButton, WhiteButton } from "../"
import Button from "../Button"
import ProgressButton from "../InvertedButton"
import NavigationButton from "../NavigationButton"

const largeButton = {
  height: 26,
  marginBottom: 20,
}

const style = {
  style: { margin: 10 },
}

const emptyFunc = () => ""

storiesOf("App Style/Buttons")
  .addDecorator(story =>
    <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>
      {story()}
    </View>
  )
  .add("Ghost Button", () => {
    return [
      <GhostButton text="Disabled" {...style} key="1" />,
      <GhostButton text="Clickable" onPress={emptyFunc} {...style} key="2" />,
    ]
  })
  .add("Inverted Button", () => {
    return [
      <InvertedButton text="Disabled" {...style} key="1" />,
      <InvertedButton text="Clickable" onPress={emptyFunc} {...style} key="2" />,
    ]
  })
  .add("Gray Action Button", () => {
    return [
      <GrayActionButton text="Disabled" key="1" {...style} />,
      <GrayActionButton text="Clickable" onPress={emptyFunc} key="2" {...style} />,
    ]
  })
  .add("White Button", () => {
    return [
      <WhiteButton text="Disabled" key="1" {...style} />,
      <WhiteButton text="Clickable" onPress={emptyFunc} key="2" {...style} />,
    ]
  })
  .add("Progress Button", () => [
    <View style={largeButton} key="1">
      <ProgressButton text="Disabled" />
    </View>,
    <View style={largeButton} key="2">
      <ProgressButton text="Clickable" onPress={emptyFunc} />
    </View>,
    <View style={largeButton} key="3">
      <ProgressButton text="In Progress..." inProgress={true} />
    </View>,
  ])
  .add("Navigation Button", () => <NavigationButton title="Default" href="/link/place" />)
  .add("Dark Navigation Button", () =>
    <DarkNavigationButton title="Default button with some text" href="/link/place" />
  )
  .add("Button (dev)", () => {
    const colorfulTheme = {
      enabled: {
        foreground: "white",
        background: "black",
        border: "black",
      },
      disabled: {
        foreground: "blue",
        background: "red",
        border: "green",
      },
      highlighted: {
        foreground: "green",
        background: "orange",
        border: "blue",
      },
    }
    return [
      <Button text="Disabled" style={largeButton} stateColors={colorfulTheme} key="1" />,
      <Button text="Enabled" style={largeButton} stateColors={colorfulTheme} onPress={emptyFunc} key="2" />,
    ]
  })
