import { Flex, Text } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { Button } from "palette"
import { withScreenDimensions } from "storybook/decorators"
import { ToolTip, ToolTipContext } from "./ToolTip"

storiesOf("ToolTip", module)
  .addDecorator(withScreenDimensions)
  .add("Simple ToolTip", () => (
    <Flex alignSelf="center" mt="200px" alignItems="center" flexWrap="wrap">
      <ToolTip initialToolTipText="Tap to dismiss me" position="TOP" tapToDismiss>
        <Text weight="medium">I am a Text</Text>
      </ToolTip>
    </Flex>
  ))
  .add("Bottom ToolTip", () => (
    <Flex alignSelf="center" mt="200px" flexWrap="wrap">
      <ToolTip initialToolTipText="Bottom tooltip" position="BOTTOM" tapToDismiss>
        <Text weight="medium">I am a Text</Text>
      </ToolTip>
    </Flex>
  ))
  .add("Change ToolTip", () => (
    <Flex alignSelf="center" mt="200px">
      <ToolTip initialToolTipText="I can be changed" position="TOP" tapToDismiss>
        <ToolTipContext.Consumer>
          {({ setToolTip }) => {
            return (
              <Button size="small" onPress={() => setToolTip("I'm the new tooltip")}>
                Press To Change ToolTip
              </Button>
            )
          }}
        </ToolTipContext.Consumer>
      </ToolTip>
    </Flex>
  ))
