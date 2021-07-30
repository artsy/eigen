import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import React from "react"
import { View } from "react-native"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { List, Row } from "storybook/helpers"
import { ColorV2, isThemeV2, useTheme } from "./Theme"

const ColorSquare = ({ color: theColor, bright }: { color: ColorV2; bright?: boolean }) => {
  const { theme, color, colorV2 } = useTheme()

  const colorFunc = isThemeV2(theme) ? colorV2 : color

  return (
    <View>
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
      />
      <Text color="black">{theColor}</Text>
      <Text color="lightgrey">{colorFunc(theColor)}</Text>
    </View>
  )
}

storiesOf("Theme/Color V2", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("colors", () => (
    <List>
      <Row>
        <ColorSquare color="black100" />
        <ColorSquare color="black80" />
        <ColorSquare color="black60" />
        <ColorSquare color="black30" />
      </Row>
      <Row>
        <ColorSquare color="black10" />
        <ColorSquare color="black5" />
        <ColorSquare color="white100" bright />
      </Row>
      <Row>
        <ColorSquare color="blue100" />
        <ColorSquare color="blue10" />
      </Row>
      <Row>
        <ColorSquare color="green100" />
        <ColorSquare color="green10" />
      </Row>
      <Row>
        <ColorSquare color="brand" />
        <ColorSquare color="purple100" />
        <ColorSquare color="purple30" />
        <ColorSquare color="purple5" />
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
        <ColorSquare color="yellow100" />
        <ColorSquare color="yellow30" />
        <ColorSquare color="yellow10" />
      </Row>
    </List>
  ))
