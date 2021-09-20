import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { LinkIcon } from "palette"
import React, { useState } from "react"
import { Button as RNButton } from "react-native"
import { DList, List } from "storybook/helpers"
import { Button, ButtonProps } from "."
import { _test_DisplayState } from "./Button"

const sizes: Array<ButtonProps["size"]> = ["small", "large"]
const variants: Array<ButtonProps["variant"]> = ["fillDark", "fillLight", "fillGray", "outline", "text"]
const states: Array<_test_DisplayState | undefined> = [
  undefined,
  _test_DisplayState.Enabled,
  _test_DisplayState.Disabled,
  _test_DisplayState.Loading,
  _test_DisplayState.Pressed,
]

storiesOf("ButtonV3", module)
  .add("Sizes", () => (
    <DList
      data={sizes}
      renderItem={({ item: size }) => (
        <Button size={size} onPress={() => console.log(`tapped ${size}`)}>
          {size}
        </Button>
      )}
    />
  ))
  .add("States", () => (
    <DList
      data={states}
      renderItem={({ item: state }) => (
        <Button variant="fillLight" testOnly_state={state} onPress={() => action(`tapped ${state}`)}>
          {state ?? "regular button"}
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
      <Button loading disabled>
        loading and disabled
      </Button>
      <Button block>block</Button>
      <Button icon={<LinkIcon />}>left icon</Button>
      <Button icon={<LinkIcon />} iconPosition="right">
        right icon
      </Button>
    </List>
  ))
  .add("Playground", () => {
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [block, setBlock] = useState(false)

    return (
      <>
        <RNButton title="loading" onPress={() => setLoading((v) => !v)} />
        <RNButton title="disabled" onPress={() => setDisabled((v) => !v)} />
        <RNButton title="block" onPress={() => setBlock((v) => !v)} />
        <List>
          <Button loading={loading} disabled={disabled} block={block}>
            loading {loading ? "true" : "false"}, disabled {disabled ? "true" : "false"}, block{" "}
            {block ? "true" : "false"}
          </Button>
        </List>
      </>
    )
  })
