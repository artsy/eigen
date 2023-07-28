import {
  Spacer,
  IconProps,
  FlexProps,
  Flex,
  useColor,
  Text,
  useTextStyleForPalette,
  Color,
} from "@artsy/palette-mobile"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { useState } from "react"
import { GestureResponderEvent, Pressable, PressableProps } from "react-native"
import { config } from "react-spring"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native"
import styled from "styled-components/native"

type PillSize = "xxs" | "xs" | "sm"

export interface PillProps extends FlexProps {
  badge?: boolean
  block?: boolean
  children: React.ReactNode
  disabled?: boolean
  highlightEnabled?: boolean
  Icon?: React.FC<IconProps>
  iconPosition?: "left" | "right"
  imageUrl?: string
  onPress?: PressableProps["onPress"]
  pressablePros?: Omit<
    PressableProps,
    "style" | "disabled" | "onPress" | "onPressIn" | "onPressOut"
  >
  rounded?: boolean
  selected?: boolean
  size?: PillSize
  /** Allows for overriding the pill style when in different states */
  stateStyle?: { [key in DisplayState]?: ReturnType<typeof useStyleForState> }
}

enum DisplayState {
  Badge = "badge",
  Disabled = "disabled",
  Enabled = "enabled",
  Pressed = "pressed",
  Selected = "selected",
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

/**
 * @deprecated
 * Use `Pill` from palette instead.
 */
export const Pill: React.FC<PillProps> = ({
  badge,
  block = false,
  children,
  disabled,
  highlightEnabled = false,
  Icon,
  iconPosition = "left",
  imageUrl,
  onPress,
  pressablePros = {},
  rounded,
  selected = false,
  size = "xxs",
  stateStyle,
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
  } else if (badge) {
    displayState = DisplayState.Badge
  }

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)
  }

  const iconSpacerMargin = size === "xxs" ? 0.5 : 1
  const to = useStyleForState(displayState, stateStyle)
  const iconColor = to.textColor as Color

  return (
    <Spring native to={to} config={config.stiff}>
      {(springProps: typeof to) => (
        <Pressable
          {...pressablePros}
          style={block ? {} : { alignSelf: "flex-start" }}
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
                <Icon fill={iconColor} />
                <Spacer x={iconSpacerMargin} />
              </>
            )}
            {!!imageUrl && <OpaqueImageViewContainer imageURL={imageUrl} />}
            <AnimatedText numberOfLines={1} style={[textStyle, { color: springProps.textColor }]}>
              {children}
            </AnimatedText>
            {iconPosition === "right" && !!Icon && (
              <>
                <Spacer x={iconSpacerMargin} />
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
  state: DisplayState,
  stateStyle: PillProps["stateStyle"]
): { textColor: string; borderColor: string; backgroundColor: string } => {
  const color = useColor()

  const retval = {} as ReturnType<typeof useStyleForState>
  let desiredStyleForState

  switch (state) {
    case DisplayState.Pressed: {
      desiredStyleForState = stateStyle?.pressed
      retval.textColor = desiredStyleForState?.textColor ?? color("blue100")
      retval.borderColor = desiredStyleForState?.borderColor ?? color("blue100")
      retval.backgroundColor = desiredStyleForState?.backgroundColor ?? color("white100")
      break
    }
    case DisplayState.Selected: {
      desiredStyleForState = stateStyle?.selected
      retval.textColor = desiredStyleForState?.textColor ?? color("white100")
      retval.borderColor = desiredStyleForState?.borderColor ?? color("blue100")
      retval.backgroundColor = desiredStyleForState?.backgroundColor ?? color("blue100")
      break
    }
    case DisplayState.Enabled: {
      desiredStyleForState = stateStyle?.enabled
      retval.textColor = desiredStyleForState?.textColor ?? color("black100")
      retval.borderColor = desiredStyleForState?.borderColor ?? color("black60")
      retval.backgroundColor = desiredStyleForState?.backgroundColor ?? color("white100")
      break
    }
    case DisplayState.Disabled: {
      desiredStyleForState = stateStyle?.disabled
      retval.textColor = desiredStyleForState?.textColor ?? color("black30")
      retval.borderColor = desiredStyleForState?.borderColor ?? color("black30")
      retval.backgroundColor = desiredStyleForState?.backgroundColor ?? color("white100")
      break
    }
    case DisplayState.Badge: {
      desiredStyleForState = stateStyle?.badge
      retval.textColor = desiredStyleForState?.textColor ?? color("blue100")
      retval.borderColor = desiredStyleForState?.borderColor ?? color("blue10")
      retval.backgroundColor = desiredStyleForState?.backgroundColor ?? color("blue10")
      break
    }
    default: {
      assertNever(state)
    }
  }

  return retval
}

const Container = styled(Flex)<PillProps>`
  border-width: 1px;
`

export const OpaqueImageViewContainer = styled(OpaqueImageView)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  margin-right: 10px;
`

const AnimatedContainer = animated(Container)
const AnimatedText = animated(Text)
