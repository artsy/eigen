import { storiesOf } from "@storybook/react-native"
import { Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { withHooks, withThemeV3 } from "storybook/decorators"
import { List } from "storybook/helpers"
import { useColor } from "./hooks"
import { ColorV3 } from "./Theme"

const ColorSquare = ({ color: theColor, bright }: { color: ColorV3; bright?: boolean }) => {
  const color = useColor()
  return (
    <View>
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
      />
      <Text color="black">{theColor}</Text>
      <Text color="lightgrey">{color(theColor)}</Text>
    </View>
  )
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <Flex width="100%" flexDirection="row" justifyContent="space-evenly">
    {children}
  </Flex>
)

storiesOf("Theme/Color", module)
  .addDecorator(withThemeV3)
  .addDecorator(withHooks)
  .add("colors", () => (
    <List>
      <Row>
        <ColorSquare color="black100" />
        <ColorSquare color="black60" />
        <ColorSquare color="black30" />
      </Row>
      <Row>
        <ColorSquare color="black15" />
        <ColorSquare color="black10" />
        <ColorSquare color="black5" />
        <ColorSquare color="white100" bright />
      </Row>
      <Row>
        <ColorSquare color="brand" />
        <ColorSquare color="blue100" />
        <ColorSquare color="blue10" />
      </Row>
      <Row>
        <ColorSquare color="green100" />
        <ColorSquare color="green10" />
      </Row>
      <Row>
        <ColorSquare color="red100" />
        <ColorSquare color="red10" />
      </Row>
      <Row>
        <ColorSquare color="copper100" />
        <ColorSquare color="copper10" />
      </Row>
      <Row>
        <ColorSquare color="devpurple" />
      </Row>
    </List>
  ))
