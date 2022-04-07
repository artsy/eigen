import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Color } from "palette/Theme"
import { Flex, FlexProps } from "../Flex"
import { Text, useTextStyleForPalette } from "../Text"

import { IconProps, Spacer, useColor } from "palette"
import { useState } from "react"
import { GestureResponderEvent, Pressable, PressableProps } from "react-native"
import { config } from "react-spring"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native"
import styled from "styled-components/native"

type PillSize = "xxs" | "xs" | "sm"

export interface PillProps extends FlexProps {
  children: React.ReactNode
  size?: PillSize
  onPress?: PressableProps["onPress"]
  rounded?: boolean
  Icon?: React.FC<IconProps>
  iconPosition?: "left" | "right"
  disabled?: boolean
  selected?: boolean
  imageUrl?: string
  highlightEnabled?: boolean
}

enum DisplayState {
  Enabled = "enabled",
  Pressed = "pressed",
  Selected = "selected",
  Disabled = "disabled",
}

const getSize = (size: PillSize): { height: number; paddingRight: number; paddingLeft: number } => {
  switch (size) {
    case "xxs":
      return {
        height: 30,
        paddingRight: 10,
        paddingLeft: 10,
      }
    case "xs":
      return {
        height: 40,
        paddingRight: 20,
        paddingLeft: 20,
      }
    case "sm":
      return {
        height: 50,
        paddingRight: 20,
        paddingLeft: 10,
      }
  }
}

export const Pill: React.FC<PillProps> = ({
  size = "xxs",
  selected = false,
  Icon,
  iconPosition = "left",
  imageUrl,
  onPress,
  children,
  disabled,
  rounded,
  highlightEnabled = false,
  ...rest
}) => {
  const textStyle = useTextStyleForPalette(size === "xxs" ? "xs" : "sm")
  const [isPressed, setIsPressed] = useState(false)
  const { height, paddingLeft, paddingRight } = getSize(size)

  let displayState = DisplayState.Enabled

  if (isPressed) {
    displayState = DisplayState.Pressed
  } else if (selected) {
    displayState = DisplayState.Selected
  } else if (disabled) {
    displayState = DisplayState.Disabled
  }

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)
  }

  const iconSpacerMargin = size === "xxs" ? 0.5 : 1
  const to = useStyleForState(displayState)
  const iconColor = to.textColor as Color

  return (
    <Spring native to={to} config={config.stiff}>
      {(springProps: typeof to) => (
        <Pressable
          disabled={disabled || !onPress}
          onPress={handlePress}
          onPressIn={() => {
            if (highlightEnabled) {
              setIsPressed(true)
            }
          }}
          onPressOut={() => {
            if (highlightEnabled) {
              setIsPressed(false)
            }
          }}
        >
          <AnimatedContainer
            borderRadius={rounded ? 50 : 0}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            height={height}
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}
            style={{
              borderColor: springProps.borderColor,
              backgroundColor: springProps.backgroundColor,
            }}
            {...rest}
          >
            {iconPosition === "left" && !!Icon && (
              <>
                {<Icon fill={iconColor} />}
                <Spacer mr={iconSpacerMargin} />
              </>
            )}
            {!!imageUrl && <OpaqueImageViewContainer imageURL={imageUrl} />}
            <AnimatedText numberOfLines={1} style={[textStyle, { color: springProps.textColor }]}>
              {children}
            </AnimatedText>
            {iconPosition === "right" && !!Icon && (
              <>
                <Spacer mr={iconSpacerMargin} />
                <Icon fill={iconColor} />
              </>
            )}
          </AnimatedContainer>
        </Pressable>
      )}
    </Spring>
  )
}

const useStyleForState = (
  state: DisplayState
): { textColor: string; borderColor: string; backgroundColor: string } => {
  const color = useColor()

  const retval = {} as ReturnType<typeof useStyleForState>

  switch (state) {
    case DisplayState.Pressed:
      retval.textColor = color("blue100")
      retval.borderColor = color("blue100")
      retval.backgroundColor = color("white100")
      break
    case DisplayState.Selected:
      retval.textColor = color("white100")
      retval.borderColor = color("blue100")
      retval.backgroundColor = color("blue100")
      break
    case DisplayState.Enabled:
      retval.textColor = color("black100")
      retval.borderColor = color("black60")
      retval.backgroundColor = color("white100")
      break
    case DisplayState.Disabled:
      retval.textColor = color("black30")
      retval.borderColor = color("black30")
      retval.backgroundColor = color("white100")
      break
    default:
      assertNever(state)
  }

  return retval
}

const Container = styled(Flex)<PillProps>`
  border-width: 1;
`

export const OpaqueImageViewContainer = styled(OpaqueImageView)`
  width: 30;
  height: 30;
  border-radius: 15;
  overflow: hidden;
  margin-right: 10;
`

const AnimatedContainer = animated(Container)
const AnimatedText = animated(Text)
