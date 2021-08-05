import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { TextV3, TextV3Props } from "."
import { Flex } from "../Flex"

const sizes: Array<TextV3Props["size"]> = ["xs", "s", "m", "l", "xl", "xxl"]

storiesOf("Theme/TextV3", module)
  .addDecorator(withThemeV3)
  .add("sizes", () => (
    <DList data={sizes} renderItem={({ item: size }) => <TextV3 size={size}>{size} ~~ This is a v3 text.</TextV3>} />
  ))
  .add("Variants", () => (
    <List>
      <Flex flexDirection="row">
        <TextV3>regular ~~ </TextV3>
        <TextV3>This is a v3 text.</TextV3>
      </Flex>
      <Flex flexDirection="row">
        <TextV3>caps ~~ </TextV3>
        <TextV3 caps>This is a v3 text.</TextV3>
      </Flex>
      <Flex flexDirection="row">
        <TextV3>italics ~~ </TextV3>
        <TextV3 italic>This is a v3 text.</TextV3>
      </Flex>
      <Flex flexDirection="row">
        <TextV3>caps italics ~~ </TextV3>
        <TextV3 caps italic>
          This is a v3 text.
        </TextV3>
      </Flex>
    </List>
  ))
