import { storiesOf } from "@storybook/react-native"
import { Banner, Message, Text } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"

storiesOf("Message", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List contentContainerStyle={{ marginHorizontal: 20, alignItems: "stretch" }}>
      <Message>
        <Text>Hallo</Text>
      </Message>
      <Banner variant="default" text="Hallo" title="" />
    </List>
  ))
