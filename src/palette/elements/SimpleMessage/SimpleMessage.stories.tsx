import { storiesOf } from "@storybook/react-native"
import { SimpleMessage, Text } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("SimpleMessage", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <SimpleMessage>
        <Text>This is a simple message.</Text>
      </SimpleMessage>
    </List>
  ))
