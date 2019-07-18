import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { FormButton } from "lib/Components/Consignments/Components/FormElements"
import NavigationButton from "../NavigationButton"

const emptyFunc = () => ""

storiesOf("App Style/Buttons")
  .addDecorator(story => <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>{story()}</View>)
  .add("FormButton", () => {
    return [<FormButton text="Disabled" key="1" />, <FormButton text="Clickable" onPress={emptyFunc} key="2" />]
  })
  .add("Navigation Button", () => <NavigationButton title="Default" href="/link/place" />)
  .add("Dark Navigation Button", () => (
    <DarkNavigationButton title="Default button with some text" href="/link/place" />
  ))
