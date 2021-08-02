import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { LinkIcon } from "palette"
import React from "react"
import { DList, List } from "storybook/helpers"
import { _DisplayState, Button, ButtonSize, ButtonVariant } from "./Button"

const sizes: ButtonSize[] = ["small", "large"]
const variants: ButtonVariant[] = ["fillDark", "fillLight", "fillGray", "outline", "text"]
const states: Array<_DisplayState | undefined> = [
  undefined,
  _DisplayState.Enabled,
  _DisplayState.Pressed,
  _DisplayState.Loading,
  _DisplayState.Disabled,
]

storiesOf("ButtonV3", module)
  .add("Sizes", () => (
    <DList
      data={sizes}
      renderItem={({ item: size }) => (
        <Button size={size} onPress={() => action(`tapped ${size}`)}>
          {size}
        </Button>
      )}
    />
  ))
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <Button variant={variant} onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </Button>
      )}
    />
  ))
  .add("Variants (loading)", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <Button variant={variant} loading onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </Button>
      )}
    />
  ))
  .add("Variants (disabled)", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <Button variant={variant} disabled onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </Button>
      )}
    />
  ))
  .add("States", () => (
    <DList
      data={states}
      renderItem={({ item: state }) => (
        <Button variant="fillLight" _state={state} onPress={() => action(`tapped ${state}`)}>
          {state ?? "regular button"}
        </Button>
      )}
    />
  ))
  .add("Miscellaneous", () => (
    <List>
      <Button loading>loading</Button>
      <Button disabled>disabled</Button>
      <Button block>block</Button>
      <Button icon={<LinkIcon />}>left icon</Button>
      <Button icon={<LinkIcon />} iconPosition="right">
        right icon
      </Button>
    </List>
  ))
