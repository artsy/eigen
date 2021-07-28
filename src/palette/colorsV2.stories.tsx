import { storiesOf } from "@storybook/react-native"
import { Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { List } from "storybook/helpers"
import { ColorV2, isThemeV2, useTheme } from "./Theme"

const ColorSquare = ({ color: theColor, bright, dark }: { color: ColorV2; bright?: boolean; dark?: boolean }) => {
  const { theme, color, colorV2 } = useTheme()

  const colorFunc = isThemeV2(theme) ? colorV2 : color

  return (
    <View
      style={[
        {
          backgroundColor: colorFunc(theColor),
          width: 80,
          height: 80,
          alignItems: "center",
          justifyContent: "center",
        },
        bright && {
          borderWidth: 0.5,
          borderColor: "grey",
        },
      ]}
    >
      <Text color={dark ? "white" : "black"}>{theColor}</Text>
    </View>
  )
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <Flex width="100%" flexDirection="row" justifyContent="space-evenly">
    {children}
  </Flex>
)

storiesOf("Color V2", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("colors", () => (
    <List>
      <Row>
        <ColorSquare color="black100" dark />
        <ColorSquare color="black80" dark />
        <ColorSquare color="black60" dark />
        <ColorSquare color="black30" />
      </Row>
      <Row>
        <ColorSquare color="black10" />
        <ColorSquare color="black5" />
        <ColorSquare color="white100" bright />
      </Row>
      <Row>
        <ColorSquare color="blue100" dark />
        <ColorSquare color="blue10" />
      </Row>
      <Row>
        <ColorSquare color="green100" dark />
        <ColorSquare color="green10" />
      </Row>
      <Row>
        <ColorSquare color="brand" dark />
        <ColorSquare color="purple100" dark />
        <ColorSquare color="purple30" />
        <ColorSquare color="purple5" />
      </Row>
      <Row>
        <ColorSquare color="red100" dark />
        <ColorSquare color="red10" />
      </Row>
      <Row>
        <ColorSquare color="copper100" dark />
        <ColorSquare color="copper10" />
      </Row>
      <Row>
        <ColorSquare color="yellow100" dark />
        <ColorSquare color="yellow30" />
        <ColorSquare color="yellow10" />
      </Row>
    </List>
  ))
