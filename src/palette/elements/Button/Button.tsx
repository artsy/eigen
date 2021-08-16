import { useColor } from "palette/hooks"
import React, { ReactNode, useState } from "react"
import { PressableProps, TextStyle } from "react-native"
import { GestureResponderEvent, Pressable } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import { config } from "react-spring"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native"
import styled from "styled-components/native"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { TextV3 } from "../Text"

export interface ButtonProps extends BoxProps {
  children: ReactNode

  size?: "small" | "large"
  variant?: "fillDark" | "fillLight" | "fillGray" | "outline" | "text"
  onPress?: PressableProps["onPress"]

  icon?: ReactNode
  iconPosition?: "left" | "right"

  /**
   * `haptic` can be used like:
   * <Button haptic />
   * or
   * <Button haptic="impactHeavy" />
   * to add haptic feedback on the button.
   */
  haptic?: HapticFeedbackTypes | true

  /** Displays a loader in the button */
  loading?: boolean

  /** Disabled interactions */
  disabled?: boolean

  /** Makes button full width */
  block?: boolean

  /** Pass the longest text to the button for the button to keep longest text width */
  longestText?: string

  /** Used only for tests and stories */
  testOnly_state?: DisplayState
}

enum DisplayState {
  Enabled = "enabled",
  Disabled = "disabled",
  Loading = "loading",
  Pressed = "pressed",
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  haptic,
  icon,
  iconPosition = "left",
  loading,
  longestText,
  onPress,
  size = "large",
  style,
  variant = "fillDark",
  testOnly_state,
  ...rest
}) => {
  const [displayState, setDisplayState] = useState(
    testOnly_state ?? (loading ? DisplayState.Loading : disabled ? DisplayState.Disabled : DisplayState.Enabled)
  )

  const getSize = (): { height: number; px: number } => {
    switch (size) {
      case "small":
        return { height: 30, px: 15 }
      case "large":
        return { height: 50, px: 30 }
    }
  }

  const spinnerColor = variant === "text" ? "blue100" : "white100"

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress === undefined || onPress === null) {
      return
    }

    if (displayState === DisplayState.Loading || displayState === DisplayState.Disabled) {
      return
    }

    // Did someone tap really fast? Flick the highlighted state
    if (displayState === DisplayState.Enabled) {
      setDisplayState(DisplayState.Pressed)
      setTimeout(() => {
        setDisplayState(DisplayState.Enabled)
      }, 0.3)
    } else {
      // Was already selected
      setDisplayState(DisplayState.Enabled)
    }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(event)
  }

  const containerSize = getSize()
  const to = useStyleForVariantAndState(variant, testOnly_state ?? displayState)
  const iconBox = <Box opacity={displayState === DisplayState.Loading ? 0 : 1}>{icon}</Box>

  return (
    <Spring native to={to} config={config.stiff}>
      {(springProps: typeof to) => (
        <Pressable
          testOnly_pressed={testOnly_state === DisplayState.Pressed}
          disabled={testOnly_state === DisplayState.Disabled || disabled}
          onPressIn={() => {
            if (displayState === DisplayState.Loading) {
              return
            }
            setDisplayState(DisplayState.Pressed)
          }}
          onPressOut={() => {
            if (displayState === DisplayState.Loading) {
              return
            }
            setDisplayState(DisplayState.Enabled)
          }}
          onPress={handlePress}
        >
          <Flex flexDirection="row">
            <AnimatedContainer
              {...rest}
              style={{
                flexDirection: "row",
                backgroundColor: springProps.backgroundColor,
                borderColor: springProps.borderColor,
                height: containerSize.height,
              }}
              px={containerSize.px}
            >
              <VisibleTextContainer>
                {iconPosition === "left" && iconBox}
                <AnimatedTextV3
                  size={size === "small" ? "xs" : "sm"}
                  style={{ color: springProps.textColor, textDecorationLine: springProps.textDecorationLine }}
                >
                  {children}
                </AnimatedTextV3>
                {iconPosition === "right" && iconBox}
              </VisibleTextContainer>

              <HiddenContainer>
                {icon}
                <TextV3 size={size === "small" ? "xs" : "sm"}>{longestText ? longestText : children}</TextV3>
              </HiddenContainer>

              {displayState === DisplayState.Loading ? <Spinner size={size} color={spinnerColor} /> : null}
            </AnimatedContainer>
          </Flex>
        </Pressable>
      )}
    </Spring>
  )
}

const useStyleForVariantAndState = (
  variant: Exclude<ButtonProps["variant"], undefined>,
  state: DisplayState
): {
  backgroundColor: string
  borderColor: string
  borderWidth?: number
  textColor: string
  textDecorationLine?: TextStyle["textDecorationLine"]
} => {
  const color = useColor()

  const retval = {
    textDecorationLine: "none",
  } as ReturnType<typeof useStyleForVariantAndState>

  if (state === DisplayState.Loading) {
    retval.backgroundColor = variant === "text" ? color("black10") : color("blue100")
    retval.borderColor = "transparent"
    retval.borderWidth = 0
    retval.textColor = "transparent"
    return retval
  }

  switch (variant) {
    case "fillDark":
      retval.textColor = color("white100")
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = color("black100")
          retval.borderColor = color("black100")
          break
        case DisplayState.Disabled:
          retval.backgroundColor = color("black30")
          retval.borderColor = color("black30")
          break
        case DisplayState.Pressed:
          retval.backgroundColor = color("blue100")
          retval.borderColor = color("blue100")
          retval.textDecorationLine = "underline"
          break
        default:
          assertNever(state)
      }
      break

    case "fillLight":
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = color("white100")
          retval.borderColor = color("white100")
          retval.textColor = color("black100")
          break
        case DisplayState.Disabled:
          retval.backgroundColor = color("black30")
          retval.borderColor = color("black30")
          retval.textColor = color("white100")
          break
        case DisplayState.Pressed:
          retval.backgroundColor = color("blue100")
          retval.borderColor = color("blue100")
          retval.textColor = color("white100")
          retval.textDecorationLine = "underline"
          break
        default:
          assertNever(state)
      }
      break

    case "fillGray":
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = color("black10")
          retval.borderColor = color("black10")
          retval.textColor = color("black100")
          break
        case DisplayState.Disabled:
          retval.backgroundColor = color("black30")
          retval.borderColor = color("black30")
          retval.textColor = color("white100")
          break
        case DisplayState.Pressed:
          retval.backgroundColor = color("blue100")
          retval.borderColor = color("blue100")
          retval.textColor = color("white100")
          retval.textDecorationLine = "underline"
          break
        default:
          assertNever(state)
      }
      break

    case "outline":
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = color("white100")
          retval.borderColor = color("black100")
          retval.textColor = color("black100")
          break
        case DisplayState.Disabled:
          retval.backgroundColor = color("white100")
          retval.borderColor = color("black30")
          retval.textColor = color("black30")
          break
        case DisplayState.Pressed:
          retval.backgroundColor = color("blue100")
          retval.borderColor = color("blue100")
          retval.textColor = color("white100")
          retval.textDecorationLine = "underline"
          break
        default:
          assertNever(state)
      }
      break

    case "text":
      switch (state) {
        case DisplayState.Enabled:
          return {
            backgroundColor: color("white100"),
            borderColor: color("white100"),
            textColor: color("black100"),
          }
        case DisplayState.Disabled:
          return {
            backgroundColor: color("white100"),
            borderColor: color("white100"),
            textColor: color("black30"),
          }
        case DisplayState.Pressed:
          return {
            backgroundColor: color("black10"),
            borderColor: color("black10"),
            textColor: color("blue100"),
            textDecorationLine: "underline",
          }
        default:
          assertNever(state)
      }
      break

    default:
      assertNever(variant)
  }

  return retval
}

const VisibleTextContainer = styled(Box)`
  position: absolute;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`

const HiddenContainer = styled(Box)<ButtonProps>`
  display: flex;
  flex-direction: row;
  opacity: 0;
`

const Container = styled(Box)<ButtonProps>`
  align-items: center;
  justify-content: center;
  position: relative;
  border-width: 1;
  border-radius: 50;
  width: ${(p) => (p.block ? "100%" : "auto")};
`

const AnimatedContainer = animated(Container)
const AnimatedTextV3 = animated(TextV3)

export { DisplayState as _test_DisplayState }
