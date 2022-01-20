import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { BulletedItem } from "."
import { Flex } from ".."

storiesOf("List", module)
  .addDecorator(withTheme)
  .add("Bulleted Item", () => (
    <List>
      <Flex>
        <BulletedItem> Bulleted Item text</BulletedItem>
        <BulletedItem>
          The good thing about Bulleted Item text is that the bullet is aligned separately from the rest of the text
        </BulletedItem>
      </Flex>
    </List>
  ))
