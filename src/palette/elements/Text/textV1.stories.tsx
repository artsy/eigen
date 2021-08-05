import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { DList } from "storybook/helpers"
import { Sans, SansProps, SansV1, SansV1Props, Serif, SerifV1 } from "."
import { isThemeV2, useTheme } from "../../Theme"

const sansSizes: Array<SansV1Props["size"]> = [
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
const serifSizes: Array<SerifV1Props["size"]> = ["1", "2", "3", "3t", "4", "4t", "5", "5t", "6", "8", "10", "12"]

const SansWrapper: React.FC<SansProps> = (props) => {
  const { theme } = useTheme()
  const Comp = isThemeV2(theme) ? SansV1 : Sans
  // @ts-ignore
  return <Comp {...props} />
}

const SerifWrapper: React.FC<SansProps> = (props) => {
  const { theme } = useTheme()
  const Comp = isThemeV2(theme) ? SerifV1 : Serif
  // @ts-ignore
  return <Comp {...props} />
}

storiesOf("Theme/TextV1", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("Sans Sizes", () => (
    <DList
      data={sansSizes}
      // @ts-ignore
      renderItem={({ item: size }) => <SansWrapper size={size}>{size} This is a sans text.</SansWrapper>}
    />
  ))
  .add("Serif Sizes", () => (
    <DList
      data={serifSizes}
      // @ts-ignore
      renderItem={({ item: size }) => <SerifWrapper size={size}>{size} This is a serif text.</SerifWrapper>}
    />
  ))
