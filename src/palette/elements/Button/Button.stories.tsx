import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { Wrap } from "app/utils/Wrap"
import { BellIcon, Box, Flex, LinkIcon, Spacer } from "palette"
import { useState } from "react"
import { Button as RNButton } from "react-native"
import { withHooks, withScreenDimensions, withTheme } from "storybook/decorators"
import { DataList, List } from "storybook/helpers"
import { Button, ButtonProps, CTAButton, FollowButton, LinkButton } from "."
import { _test_DisplayState } from "./Button"

const sizes: Array<ButtonProps["size"]> = ["small", "large"]
const variants: Array<ButtonProps["variant"]> = [
  "fillDark",
  "fillLight",
  "fillGray",
  "fillSuccess",
  "outline",
  "outlineGray",
  "outlineLight",
  "text",
]
const states: Array<_test_DisplayState | undefined> = [
  undefined,
  _test_DisplayState.Enabled,
  _test_DisplayState.Disabled,
  _test_DisplayState.Loading,
  _test_DisplayState.Pressed,
]

storiesOf("Button", module)
  .addDecorator(withTheme)
  .addDecorator(withScreenDimensions)
  .addDecorator(withHooks)
  .add("Sizes", () => (
    <DataList
      data={sizes}
      renderItem={({ item: size }) => (
        <Button size={size} onPress={() => console.log(`tapped ${size}`)}>
          {size}
        </Button>
      )}
    />
  ))
  .add("States", () => (
    <DataList
      data={states}
      renderItem={({ item: state }) => (
        <Button
          variant="fillLight"
          testOnly_state={state}
          onPress={() => action(`tapped ${state}`)}
        >
          {state ?? "regular button"}
        </Button>
      )}
    />
  ))
  .add("Call To Action Button (CTA Button)", () => (
    <List>
      <CTAButton onPress={() => console.log("pressed")}>cta button</CTAButton>
    </List>
  ))
  .add("LinkButton", () => (
    <List>
      <LinkButton onPress={() => console.log("pressed")}>LinkButton</LinkButton>
    </List>
  ))
  .add("Variants", () => (
    <DataList
      data={variants}
      renderItem={({ item: variant }) => (
        <Wrap if={variant === "outlineLight" || variant === "fillLight"}>
          <Flex backgroundColor="black100" p={10}>
            <Wrap.Content>
              <Button variant={variant} onPress={() => action(`tapped ${variant}`)}>
                {variant}
              </Button>
            </Wrap.Content>
          </Flex>
        </Wrap>
      )}
    />
  ))
  .add("Variants (loading)", () => (
    <DataList
      data={variants}
      renderItem={({ item: variant }) => (
        <Button variant={variant} loading onPress={() => action(`tapped ${variant}`)}>
          {variant}
        </Button>
      )}
    />
  ))
  .add("Variants (disabled)", () => (
    <DataList
      data={variants}
      renderItem={({ item: variant }) => (
        <Wrap if={variant === "outlineLight"}>
          <Flex backgroundColor="black100" p={10}>
            <Wrap.Content>
              <Button variant={variant} disabled onPress={() => action(`tapped ${variant}`)}>
                {variant}
              </Button>
            </Wrap.Content>
          </Flex>
        </Wrap>
      )}
    />
  ))
  .add("Miscellaneous", () => (
    <List>
      <Button loading disabled>
        loading and disabled
      </Button>
      <Button block>block</Button>
      <Flex
        backgroundColor="orange"
        width={400}
        height={80}
        alignItems="center"
        justifyContent="center"
      >
        <Button variant="fillLight" icon={<LinkIcon />}>
          left icon
        </Button>
      </Flex>
      <Button icon={<LinkIcon fill="white100" />} iconPosition="right">
        right icon
      </Button>
      <Button size="small" icon={<LinkIcon fill="white100" />} iconPosition="right">
        Right Icon Small
      </Button>
      <Button
        variant="fillDark"
        size="small"
        icon={<BellIcon fill="white100" width="16px" height="16px" />}
      >
        Create Alert
      </Button>
      <Box flexDirection="row">
        <Box width={2} height="100%" backgroundColor="green100" />
        <Box>
          <Button
            size="small"
            icon={<LinkIcon fill="white100" />}
            iconPosition="right"
            longestText="this is a very long text"
          >
            shortest text
          </Button>
          <Spacer mb={1} />
          <Button
            size="small"
            icon={<LinkIcon fill="white100" />}
            iconPosition="right"
            longestText="this is a very long text"
          >
            this is a very long text
          </Button>
        </Box>
        <Box width={2} height="100%" backgroundColor="green100" />
      </Box>
      <Button icon={<LinkIcon fill="white100" />} block iconPosition="left-start">
        left-start aligned icon
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
  .add("FollowButton", () => {
    const [follow, setFollow] = useState(true)

    return (
      <List>
        <FollowButton isFollowed={follow} onPress={() => setFollow((v) => !v)} />
      </List>
    )
  })
