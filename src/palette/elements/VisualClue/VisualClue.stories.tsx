import { storiesOf } from "@storybook/react-native"
import { Text } from "palette/elements/Text"
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
