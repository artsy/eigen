import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { DList } from "storybook/helpers"
import { TextV2, TextV2Props } from "."

const variants: Array<TextV2Props["variant"]> = [
  "small",
  "largeTitle",
  "title",
  "subtitle",
  "text",
  "mediumText",
  "caption",
]

storiesOf("Theme/TextV2", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => <TextV2 variant={variant}>{variant} ~~ This is a v2 text.</TextV2>}
    />
  ))
