import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Text } from "../Text"
import { VisualClueDot, VisualClueText } from "./"

storiesOf("Theme/Text", module)
  .addDecorator(withTheme)

  .add("Visual Clue", () => (
    <List>
      <VisualClueDot />
      <>
        <Text>A Feature</Text>
        <VisualClueText style={{ top: 14, right: -36 }} />
      </>
    </List>
  ))
