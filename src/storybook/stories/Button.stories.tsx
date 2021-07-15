import { storiesOf } from "@storybook/react-native"
import { Button, ButtonSize, ButtonVariant } from "palette"
import React from "react"
import { Text } from "react-native"
import { CenterView, List } from "./storybookHelper"

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
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add("Sizes", () => (
    <List>
      {sizes.map((size) => (
        <Button size={size}>
          <Text>{size}</Text>
        </Button>
      ))}
    </List>
  ))
  .add("Variants", () => (
    <List>
      {variants.map((variant) => (
        <Button variant={variant}>
          <Text>{variant}</Text>
        </Button>
      ))}
    </List>
  ))
  .add("States", () => (
    <List>
      <Button loading>
        <Text>{"loading"}</Text>
      </Button>
      <Button disabled>
        <Text>{"disabled"}</Text>
      </Button>
      <Button block>
        <Text>{"block"}</Text>
      </Button>
    </List>
  ))
