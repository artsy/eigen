import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { DList } from "storybook/helpers"
import { Sans, Serif } from "."
import { SansProps, SerifProps } from "./Typography"

const sansSizes: Array<SansProps["size"]> = [
  "0",
  "1",
  "2",
  "3",
  "3t",
  "4",
  "4t",
  "5",
  "5t",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
]
const serifSizes: Array<SerifProps["size"]> = ["1", "2", "3", "3t", "4", "4t", "5", "5t", "6", "8", "10", "12"]

storiesOf("Theme/TextV1", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("Sans Sizes", () => (
    <DList data={sansSizes} renderItem={({ item: size }) => <Sans size={size}>{size} This is a sans text.</Sans>} />
  ))
  .add("Serif Sizes", () => (
    <DList data={serifSizes} renderItem={({ item: size }) => <Serif size={size}>{size} This is a serif text.</Serif>} />
  ))
