import { action, storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import colors from "../../../data/colors"

import DottedLine from "../DottedLine"

storiesOf("App Style/Dotted Line")
  .addDecorator(story =>
    <View accessibilityLabel="wrapperView" style={{ height: 10, marginTop: 60, marginLeft: 20, marginRight: 20 }}>
      {story()}
    </View>
  )
  .add("Default", () => {
    return <DottedLine />
  })
  .add("With custom color", () => {
    return <DottedLine color={colors["purple-regular"]} />
  })
