import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"
import { withTheme } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { Text, TextProps } from "."

const variants: Array<TextProps["variant"]> = ["xs", "sm", "md", "lg", "xl", "xxl"]

storiesOf("Theme/Text", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => <Text variant={variant}>{variant} ~~ This is a text.</Text>}
    />
  ))
  .add("Basic props", () => (
    <List>
      <Text>regular ~~ This is a text.</Text>
      <Text caps>caps ~~ This is a text.</Text>
      <Text italic>italics ~~ This is a text.</Text>
      <Text caps italic>
        caps italics ~~ This is a text.
      </Text>
      <Text weight="medium">weight: medium ~~ This is a text.</Text>
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
