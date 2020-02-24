import { Theme } from "@artsy/palette"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"

storiesOf("App Style/Buttons")
  .addDecorator(story => <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>{story()}</View>)
  .add("Dark Navigation Button", () => (
    <Theme>
      <DarkNavigationButton title="Default button with some text" href="/link/place" />
    </Theme>
  ))
