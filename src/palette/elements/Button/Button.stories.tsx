import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { LinkIcon } from "palette"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { ButtonV3, ButtonV3Props } from "."
import { _test_DisplayState } from "./Button"

const sizes: Array<ButtonV3Props["size"]> = ["small", "large"]
const variants: Array<ButtonV3Props["variant"]> = ["fillDark", "fillLight", "fillGray", "outline", "text"]
const states: Array<_test_DisplayState | undefined> = [
  undefined,
  _test_DisplayState.Enabled,
  _test_DisplayState.Disabled,
  _test_DisplayState.Loading,
  _test_DisplayState.Pressed,
]

storiesOf("ButtonV3", module)
  .addDecorator(withThemeV3)
  .add("Sizes", () => (
    <DList
      data={sizes}
      renderItem={({ item: size }) => (
        <ButtonV3 size={size} onPress={() => console.log(`tapped ${size}`)}>
          {size}
        </ButtonV3>
      )}
    />
  ))
  .add("States", () => (
    <DList
      data={states}
      renderItem={({ item: state }) => (
        <ButtonV3 variant="fillLight" testOnly_state={state} onPress={() => action(`tapped ${state}`)}>
          {state ?? "regular button"}
        </ButtonV3>
      )}
    />
  ))
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <ButtonV3 variant={variant} onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </ButtonV3>
      )}
    />
  ))
  .add("Variants (loading)", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <ButtonV3 variant={variant} loading onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </ButtonV3>
      )}
    />
  ))
  .add("Variants (disabled)", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <ButtonV3 variant={variant} disabled onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </ButtonV3>
      )}
    />
  ))
  .add("Miscellaneous", () => (
    <List>
      <ButtonV3 loading>loading</ButtonV3>
      <ButtonV3 disabled>disabled</ButtonV3>
      <ButtonV3 loading disabled>
        loading and disabled
      </ButtonV3>
      <ButtonV3 block>block</ButtonV3>
      <ButtonV3 icon={<LinkIcon />}>left icon</ButtonV3>
      <ButtonV3 icon={<LinkIcon />} iconPosition="right">
        right icon
      </ButtonV3>
    </List>
  ))
