import { storiesOf } from "@storybook/react-native"
import { View } from "react-native"
import { List, Row } from "storybook/helpers"
import { Text } from "../elements/Text"
import { useColor } from "../hooks"
import { Color } from "../Theme"

const ColorSquare = ({ color: theColor, bright }: { color: Color; bright?: boolean }) => {
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

storiesOf("Theme/color", module).add("colors", () => (
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
