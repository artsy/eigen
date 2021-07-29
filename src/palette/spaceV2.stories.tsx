import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import React from "react"
import { View } from "react-native"
import { withThemeV2 } from "storybook/decorators"
import { List, Row } from "storybook/helpers"
import { useSpace } from "./hooks"
import { SpacingUnitV2 } from "./Theme"

const SpaceLine = ({ space: theSpace }: { space: SpacingUnitV2 }) => {
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
      <Text color="black">{theSpace}</Text>
      <Text color="black">{`${space(theSpace)}px`}</Text>
    </View>
  )
}

storiesOf("Theme/SpaceV2", module)
  .addDecorator(withThemeV2)
  .add("spaces", () => (
    <List style={{ marginLeft: 50 }} contentContainerStyle={{ alignItems: "flex-start" }}>
      <SpaceLine space={0.3} />
      <SpaceLine space={0.5} />
      <SpaceLine space={1} />
      <SpaceLine space={1.5} />
      <SpaceLine space={3} />
      <SpaceLine space={3} />
      <SpaceLine space={4} />
      <SpaceLine space={5} />
      <SpaceLine space={6} />
      <SpaceLine space={9} />
      <SpaceLine space={12} />
      <SpaceLine space={18} />
    </List>
  ))
