import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { FormButton } from "lib/Components/Consignments/Components/FormElements"
import { GhostButton } from "../"
import Button from "../Button"
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
  .addDecorator(story => <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>{story()}</View>)
  .add("FormButton", () => {
    return [<FormButton text="Disabled" key="1" />, <FormButton text="Clickable" onPress={emptyFunc} key="2" />]
  })
  .add("Ghost Button", () => {
    return [
      <GhostButton text="Disabled" {...style} key="1" />,
      <GhostButton text="Clickable" onPress={emptyFunc} {...style} key="2" />,
    ]
  })
  .add("Navigation Button", () => <NavigationButton title="Default" href="/link/place" />)
  .add("Dark Navigation Button", () => (
    <DarkNavigationButton title="Default button with some text" href="/link/place" />
  ))
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
