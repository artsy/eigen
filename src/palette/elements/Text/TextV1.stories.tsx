import { storiesOf } from "@storybook/react-native"
import React from "react"
import { View } from "react-native"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { Sans, SansV1, SansV1Props, Serif, SerifV1, SerifV1Props } from "."
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

const SansWrapper: React.FC<SansV1Props> = (props) => {
  const { theme } = useTheme()
  const Comp = isThemeV2(theme) ? SansV1 : Sans
  // @ts-ignore
  return <Comp {...props} />
}

const SerifWrapper: React.FC<SerifV1Props> = (props) => {
  const { theme } = useTheme()
  const Comp = isThemeV2(theme) ? SerifV1 : Serif
  // @ts-ignore
  return <Comp {...props} />
}

storiesOf("Theme/TextV1", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("Sans Sizes", () => (
    <List>
      <DList
        data={sansSizes}
        // @ts-ignore
        renderItem={({ item: size }) => <SansWrapper size={size}>{size} This is a sans text.</SansWrapper>}
      />
      <SansWrapper size="5" italic>
        italic ~~ This is a sans text.
      </SansWrapper>
      <SansWrapper size="5" weight={null}>
        weight: null ~~ This is a sans text.
      </SansWrapper>
      <SansWrapper size="5" weight="regular">
        weight: regular ~~ This is a sans text.
      </SansWrapper>
      <SansWrapper size="5" weight="medium">
        weight: semibold ~~ This is a sans text.
      </SansWrapper>
    </List>
  ))
  .add("Serif Sizes", () => (
    <List>
      <DList
        data={serifSizes}
        // @ts-ignore
        renderItem={({ item: size }) => <SerifWrapper size={size}>{size} This is a serif text.</SerifWrapper>}
      />
      <SerifWrapper size="5" italic>
        italic ~~ This is a serif text.
      </SerifWrapper>
      <SerifWrapper size="5" weight={null}>
        weight: null ~~ This is a serif text.
      </SerifWrapper>
      <SerifWrapper size="5" weight="regular">
        weight: regular ~~ This is a serif text.
      </SerifWrapper>
      <SerifWrapper size="5" weight="semibold">
        weight: semibold ~~ This is a serif text.
      </SerifWrapper>
      <View style={{ borderWidth: 1, borderColor: "black" }}>
        <SerifWrapper size="5" pl={2} mb={3} color="red">
          Testing the other props
        </SerifWrapper>
      </View>
    </List>
  ))
