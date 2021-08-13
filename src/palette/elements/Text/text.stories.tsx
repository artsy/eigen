import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"
import { withThemeV3 } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { TextV3, TextV3Props } from "."

const sizes: Array<TextV3Props["size"]> = ["xs", "sm", "md", "lg", "xl", "xxl"]

storiesOf("Theme/TextV3", module)
  .addDecorator(withThemeV3)
  .add("Sizes", () => (
    <DList data={sizes} renderItem={({ item: size }) => <TextV3 size={size}>{size} ~~ This is a v3 text.</TextV3>} />
  ))
  .add("Basic props", () => (
    <List>
      <TextV3>regular ~~ This is a v3 text.</TextV3>
      <TextV3 caps>caps ~~ This is a v3 text.</TextV3>
      <TextV3 italic>italics ~~ This is a v3 text.</TextV3>
      <TextV3 caps italic>
        caps italics ~~ This is a v3 text.
      </TextV3>
      <TextV3 weight="medium">weight: medium ~~ This is a v3 text.</TextV3>
    </List>
  ))
  .add("Misc", () => (
    <List>
      <View style={{ borderWidth: 1, borderColor: "black" }}>
        <TextV3 pl="2" mb="3" mr={80} color="red" backgroundColor="orange">
          Testing the other props
        </TextV3>
      </View>
      <View />
    </List>
  ))
