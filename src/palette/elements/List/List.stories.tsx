import { storiesOf } from "@storybook/react-native"
import { Spacer } from "palette"
import React from "react"
import { List } from "storybook/helpers"
import { BulletedItem } from "."
import { Flex, Text } from ".."

storiesOf("List", module).add("Bulleted Item", () => (
  <List>
    <Flex>
      <BulletedItem>Bulleted Item text</BulletedItem>
      <BulletedItem>
        The good thing about Bulleted Item text is that the bullet is aligned separately from the
        rest of the text
      </BulletedItem>
      <Spacer m={2} />
      <Text variant="sm" mx={1} color="black60">
        • Simple text acting as bulleted item
      </Text>
      <Text variant="sm" mx={1} color="black60">
        • Simple text acting as bulleted item longer text with a bullet infront of it, just like
        that. and that ain't so pretty, riiiight?!
      </Text>
    </Flex>
  </List>
))
