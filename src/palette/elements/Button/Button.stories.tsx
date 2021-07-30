import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { Button, ButtonSize, ButtonVariant } from "palette"
import React from "react"
import { DList, List } from "storybook/helpers"

const sizes: ButtonSize[] = ["small", "medium", "large"]

const variants: ButtonVariant[] = [
  "primaryBlack",
  "primaryWhite",
  "secondaryGray",
  "secondaryOutline",
  "secondaryOutlineWarning",
  "noOutline",
]

storiesOf("Button", module)
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
  .add("States", () => (
    <List>
      <Button loading>loading</Button>
      <Button disabled>disabled</Button>
      <Button block>block</Button>
    </List>
  ))
