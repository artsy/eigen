import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { DList } from "storybook/helpers"
import { Text, TextProps } from "."

const variants: Array<TextProps["variant"]> = [
  "small",
  "largeTitle",
  "title",
  "subtitle",
  "text",
  "mediumText",
  "caption",
]

storiesOf("Theme/TextV3", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => <Text variant={variant}>{variant} ~~ This is a v3 text.</Text>}
    />
  ))
