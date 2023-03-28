import { Text } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { List } from "storybook/helpers"
import { VisualClueDot, VisualClueText } from "./"

storiesOf("Theme/Text", module).add("Visual Clue", () => (
  <List>
    <VisualClueDot />
    <>
      <Text>A Feature</Text>
      <VisualClueText style={{ top: 14, right: -24 }} />
    </>
  </List>
))
