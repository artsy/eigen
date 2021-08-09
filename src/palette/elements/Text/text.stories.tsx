import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"
import { withThemeV3 } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { Text, TextProps } from "."

const sizes: Array<TextProps["size"]> = ["xs", "sm", "md", "lg", "xl", "xxl"]

storiesOf("Theme/TextV3", module)
  .addDecorator(withThemeV3)
  .add("Sizes", () => (
    <DList data={sizes} renderItem={({ item: size }) => <Text size={size}>{size} ~~ This is a v3 text.</Text>} />
  ))
  .add("Basic props", () => (
    <List>
      <Text>regular ~~ This is a v3 text.</Text>
      <Text caps>caps ~~ This is a v3 text.</Text>
      <Text italic>italics ~~ This is a v3 text.</Text>
      <Text caps italic>
        caps italics ~~ This is a v3 text.
      </Text>
      <Text weight="medium">weight: medium ~~ This is a v3 text.</Text>
    </List>
  ))
  .add("Misc", () => (
    <List>
      <View style={{ borderWidth: 1, borderColor: "black" }}>
        <Text pl="2" mb="3" mr={80} color="red" backgroundColor="orange">
          Testing the other props
        </Text>
      </View>
      <View />
    </List>
  ))
