import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { LinkIcon } from "palette"
import React from "react"
import { withThemeV3 } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { Button, ButtonV3Props } from "."

const sizes: Array<ButtonV3Props["size"]> = ["small", "large"]
const variants: Array<ButtonV3Props["variant"]> = ["fillDark", "fillLight", "fillGray", "outline", "text"]

storiesOf("ButtonV3", module)
  .addDecorator(withThemeV3)
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
