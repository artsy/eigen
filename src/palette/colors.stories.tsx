import { storiesOf } from "@storybook/react-native"
import { Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { useColor } from "./hooks"
import { ColorV3 } from "./Theme"

const ColorSquare = ({ color: theColor, bright, dark }: { color: ColorV3; bright?: boolean; dark?: boolean }) => {
  const color = useColor()
  return (
    <View
      style={[
        {
          backgroundColor: color(theColor),
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

storiesOf("Color", module)
  .addDecorator(withThemeV3)
  .add("colors", () => (
    <List>
      <Row>
        <ColorSquare color="black100" dark />
        <ColorSquare color="black60" dark />
        <ColorSquare color="black30" />
      </Row>
      <Row>
        <ColorSquare color="black15" />
        <ColorSquare color="black10" />
        <ColorSquare color="black5" />
        <ColorSquare color="white100" bright />
      </Row>
      <Row>
        <ColorSquare color="brand" dark />
        <ColorSquare color="blue100" dark />
        <ColorSquare color="blue10" />
      </Row>
      <Row>
        <ColorSquare color="green100" dark />
        <ColorSquare color="green10" />
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
        <ColorSquare color="devpurple" dark />
      </Row>
    </List>
  ))
