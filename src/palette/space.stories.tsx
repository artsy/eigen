import { storiesOf } from "@storybook/react-native"
import { TextV3 } from "palette"
import React from "react"
import { View } from "react-native"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { useSpace } from "./hooks"
import { SpacingUnitV3 } from "./Theme"

const SpaceLine = ({ space: theSpace }: { space: SpacingUnitV3 }) => {
  const space = useSpace()
  return (
    <View>
      <View
        style={{
          width: space(theSpace),
          borderBottomWidth: 1,
          borderColor: "black",
          marginBottom: 4,
        }}
      />
      <TextV3 color="black">"{theSpace}"</TextV3>
      <TextV3 color="black">{`${space(theSpace)}px`}</TextV3>
    </View>
  )
}

storiesOf("Theme/Space", module)
  .addDecorator(withThemeV3)
  .add("spaces", () => (
    <List style={{ marginLeft: 50 }} contentContainerStyle={{ alignItems: "flex-start" }}>
      <SpaceLine space="0.5" />
      <SpaceLine space="1" />
      <SpaceLine space="2" />
      <SpaceLine space="4" />
      <SpaceLine space="6" />
      <SpaceLine space="12" />
    </List>
  ))
