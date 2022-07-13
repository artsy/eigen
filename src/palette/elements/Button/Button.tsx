import { Spacer } from "palette"
import { useColor } from "palette/hooks"
import { useState } from "react"
import { PressableProps, TextStyle } from "react-native"
import { GestureResponderEvent, Pressable } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"
import { config } from "react-spring"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native"
import { MeasuredView, ViewMeasurements } from "shared/utils"
import styled from "styled-components/native"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spinner } from "../Spinner"
import { Text, useTextStyleForPalette } from "../Text"

export interface ButtonProps extends BoxProps {
  children: React.ReactNode

  size?: "small" | "large"
  variant?:
    | "fillDark"
    | "fillLight"
    | "fillGray"
    | "fillSuccess"
    | "outline"
    | "outlineGray"
    | "outlineLight"
    | "text"
  onPress?: PressableProps["onPress"]

  icon?: React.ReactNode
  iconPosition?: "left" | "left-start" | "right"

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
  testID,
  ...rest
}) => {
  const textStyle = useTextStyleForPalette(size === "small" ? "xs" : "sm")

  const [innerDisplayState, setInnerDisplayState] = useState(DisplayState.Enabled)

  const [longestTextMeasurements, setLongestTextMeasurements] = useState<ViewMeasurements>({
    width: 0,
    height: 0,
  })

  const displayState =
    testOnly_state ?? // if we use the test prop, use that
    (loading // if we have loading or disabled in props, they are used
      ? DisplayState.Loading
      : disabled
      ? DisplayState.Disabled
      : innerDisplayState) // otherwise use the inner state for pressed or enabled

  const getSize = (): { height: number; mx: number } => {
    switch (size) {
      case "small":
        return { height: 30, mx: 15 }
      case "large":
        return { height: 50, mx: 30 }
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
      setInnerDisplayState(DisplayState.Pressed)
      setTimeout(() => {
        setInnerDisplayState(DisplayState.Enabled)
      }, 0.3)
    } else {
      // Was already selected
      setInnerDisplayState(DisplayState.Enabled)
    }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(event)
  }

  const containerSize = getSize()
  const to = useStyleForVariantAndState(variant, testOnly_state ?? displayState)

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
            setInnerDisplayState(DisplayState.Pressed)
          }}
          onPressOut={() => {
            if (displayState === DisplayState.Loading) {
              return
            }
            setInnerDisplayState(DisplayState.Enabled)
          }}
          onPress={handlePress}
          testID={testID}
        >
          <Flex flexDirection="row">
            <AnimatedContainer
              {...rest}
              style={{
                backgroundColor: springProps.backgroundColor,
                borderColor: springProps.borderColor,
                height: containerSize.height,
              }}
            >
              <Flex mx={containerSize.mx}>
                <Flex height="100%" flexDirection="row" alignItems="center" justifyContent="center">
                  {iconPosition === "left-start" && !!icon ? (
                    <Box position="absolute" left={0}>
                      {icon}
                      <Spacer mr={0.5} />
                    </Box>
                  ) : null}
                  {iconPosition === "left" && !!icon ? (
                    <>
                      {icon}
                      <Spacer mr={0.5} />
                    </>
                  ) : null}
                  {/* This makes sure that in testing environment the button text is
                      not rendered twice, in normal environment this is not visible.
                      This will result in us being able to use getByText over
                      getAllByText()[0] to select the buttons in the test environment.
                  */}
                  {!__TEST__ && (
                    <MeasuredView setMeasuredState={setLongestTextMeasurements}>
                      <Text color="red" style={textStyle}>
                        {longestText ? longestText : children}
                      </Text>
                    </MeasuredView>
                  )}
                  <AnimatedText
                    style={[
                      {
                        width: Math.ceil(longestTextMeasurements.width),
                        color: springProps.textColor,
                        textDecorationLine: springProps.textDecorationLine,
                      },
                      textStyle,
                    ]}
                    textAlign="center"
                  >
                    {children}
                  </AnimatedText>
                  {iconPosition === "right" && !!icon ? (
                    <>
                      <Spacer mr={0.5} />
                      {icon}
                    </>
                  ) : null}
                </Flex>

                {displayState === DisplayState.Loading ? (
                  <SpinnerContainer>
                    <Spinner size={size} color={spinnerColor} />
                  </SpinnerContainer>
                ) : null}
              </Flex>
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
    retval.borderColor = "rgba(0, 0, 0, 0)"
    retval.borderWidth = 0
    retval.textColor = "rgba(0, 0, 0, 0)"
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

    case "fillSuccess":
      retval.textColor = color("white100")
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = color("blue100")
          retval.borderColor = color("blue100")
          break
        case DisplayState.Disabled:
          retval.backgroundColor = color("blue100")
          retval.borderColor = color("blue100")
          break
        case DisplayState.Pressed:
          retval.backgroundColor = color("blue10")
          retval.borderColor = color("blue10")
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
          retval.borderColor = color("black60")
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

    case "outlineGray":
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = color("white100")
          retval.borderColor = color("black30")
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

    case "outlineLight":
      switch (state) {
        case DisplayState.Enabled:
          retval.backgroundColor = "rgba(0, 0, 0, 0)"
          retval.borderColor = color("white100")
          retval.textColor = color("white100")
          break
        case DisplayState.Disabled:
          retval.backgroundColor = "rgba(0, 0, 0, 0)"
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
      retval.backgroundColor = "rgba(0, 0, 0, 0)"
      retval.borderColor = "rgba(0, 0, 0, 0)"
      switch (state) {
        case DisplayState.Enabled:
          retval.textColor = color("black100")
          break
        case DisplayState.Disabled:
          retval.textColor = color("black30")
          break
        case DisplayState.Pressed:
          retval.textColor = color("blue100")
          retval.textDecorationLine = "underline"
          break
        default:
          assertNever(state)
      }
      break

    default:
      assertNever(variant)
  }

  return retval
}

const Container = styled(Box)<ButtonProps>`
  position: relative;
  border-width: 1;
  border-radius: 50;
  width: ${(p) => (p.block ? "100%" : "auto")};
  overflow: hidden;
`

const SpinnerContainer = styled(Box)<ButtonProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const AnimatedContainer = animated(Container)
const AnimatedText = animated(Text)

export { DisplayState as _test_DisplayState }
