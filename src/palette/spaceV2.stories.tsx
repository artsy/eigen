import { storiesOf } from "@storybook/react-native"
import { TextV2 } from "palette"
import React from "react"
import { View } from "react-native"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { List } from "storybook/helpers"
import { isThemeV2, SpacingUnitV2, useTheme } from "./Theme"

const SpaceLine = ({ space: theSpace }: { space: SpacingUnitV2 }) => {
  const { theme, space, spaceV2 } = useTheme()
  const spaceFunc = isThemeV2(theme) ? spaceV2 : space

  return (
    <View>
      <View
        style={{
          width: spaceFunc(theSpace),
          borderBottomWidth: 1,
          borderColor: "black",
          marginBottom: 4,
        }}
      />
      <TextV2 color="black">{theSpace}</TextV2>
      <TextV2 color="black">{`${spaceFunc(theSpace)}px`}</TextV2>
    </View>
  )
}

storiesOf("Theme/Space V2", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("spaces", () => (
    <List style={{ marginLeft: 50 }} contentContainerStyle={{ alignItems: "flex-start" }}>
      <SpaceLine space={0.3} />
      <SpaceLine space={0.5} />
      <SpaceLine space={1} />
      <SpaceLine space={1.5} />
      <SpaceLine space={2} />
      <SpaceLine space={3} />
      <SpaceLine space={4} />
      <SpaceLine space={5} />
      <SpaceLine space={6} />
      <SpaceLine space={9} />
      <SpaceLine space={12} />
      <SpaceLine space={18} />
    </List>
  ))
