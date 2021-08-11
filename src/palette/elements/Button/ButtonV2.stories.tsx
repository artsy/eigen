import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { LinkIcon } from "palette"
import React from "react"
import { withThemeV2 } from "storybook/decorators"
import { DList, List } from "storybook/helpers"
import { ButtonV2, ButtonV2Props } from "."

const sizes: Array<ButtonV2Props["size"]> = ["small", "medium", "large"]

const variants: Array<ButtonV2Props["variant"]> = [
  "primaryBlack",
  "primaryWhite",
  "secondaryGray",
  "secondaryOutline",
  "secondaryOutlineWarning",
  "noOutline",
]

storiesOf("ButtonV2", module)
  .addDecorator(withThemeV2)
  .add("Sizes", () => (
    <DList
      data={sizes}
      renderItem={({ item: size }) => (
        <ButtonV2 size={size} onPress={() => action(`tapped ${size}`)}>
          {size}
        </ButtonV2>
      )}
    />
  ))
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => (
        <ButtonV2 variant={variant} onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </ButtonV2>
      )}
    />
  ))
  .add("Miscellaneous", () => (
    <List>
      <ButtonV2 loading>loading</ButtonV2>
      <ButtonV2 disabled>disabled</ButtonV2>
      <ButtonV2 block>block</ButtonV2>
      <ButtonV2 icon={<LinkIcon />}>with icon</ButtonV2>
      <ButtonV2 icon={<LinkIcon />} iconPosition="right">
        with icon
      </ButtonV2>
    </List>
  ))
