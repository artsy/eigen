import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Flex, FlexProps } from "../Flex"
import { Text, useTextStyleForPalette } from "../Text"

import { Color, IconProps, Spacer, useColor } from "palette"
import React, { ReactNode, useEffect, useState } from "react"
import { GestureResponderEvent, Pressable, PressableProps } from "react-native"
import { config } from "react-spring"
// @ts-ignore
import { animated, Spring } from "react-spring/renderprops-native"
import styled from "styled-components/native"

type PillSize = "xxs" | "xs" | "sm"

export interface PillProps extends FlexProps {
  children: ReactNode
  size?: PillSize
  onPress?: PressableProps["onPress"]
  rounded?: boolean
  Icon?: React.FC<IconProps>
  iconPosition?: "left" | "right"
  disabled?: boolean
  selected?: boolean
  imageUrl?: string
  disabledStylesEnabled?: boolean
  highlightEnabled?: boolean
}

enum DisplayState {
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
  disabledStylesEnabled = false,
  highlightEnabled = false,
  ...rest
}) => {
  const textStyle = useTextStyleForPalette(size === "xxs" ? "xs" : "sm")
  const initialDisplayState = selected ? DisplayState.Selected : DisplayState.Enabled
  const [innerDisplayState, setInnerDisplayState] = useState(initialDisplayState)
  const { height, paddingLeft, paddingRight } = getSize(size)
  const color = useColor()

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)
  }

  useEffect(() => {
    setInnerDisplayState(initialDisplayState)
  }, [selected])

  const iconSpacerMargin = size === "xxs" ? 0.5 : 1
  const iconColor = innerDisplayState === "pressed" ? "blue100" : "black100"
  const to = useStyleForState(innerDisplayState)
  return (
    <Spring native to={to} config={config.stiff}>
      {() => (
        <Pressable
          disabled={disabled || !onPress}
          onPress={handlePress}
          onPressIn={() => {
            if (highlightEnabled) {
              setInnerDisplayState(DisplayState.Pressed)
            }
          }}
          onPressOut={() => {
            if (highlightEnabled) {
              setInnerDisplayState(initialDisplayState)
            }
          }}
        >
          <AnimatedContainer
            borderRadius={!!Icon || rounded ? 50 : 0}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            height={height}
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}
            style={{
              borderColor: disabledStylesEnabled ? color("black30") : color("black60"),
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
            <AnimatedText
              numberOfLines={1}
              style={[textStyle, { color: disabledStylesEnabled ? color("black30") : color("black100") }]}
            >
              {children}
            </AnimatedText>
            {iconPosition === "right" && !!Icon && (
              <>
                <Spacer mr={iconSpacerMargin} />
                {<Icon fill={iconColor} />}
              </>
            )}
          </AnimatedContainer>
        </Pressable>
      )}
    </Spring>
  )
}

const useStyleForState = (state: DisplayState): { textColor: Color; borderColor: string } => {
  const color = useColor()

  const retval = {} as ReturnType<typeof useStyleForState>

  switch (state) {
    case DisplayState.Pressed:
      retval.textColor = "blue100"
      retval.borderColor = color("blue100")
      break
    case DisplayState.Selected:
      retval.textColor = "black100"
      retval.borderColor = color("black60")
      break
    case DisplayState.Enabled:
      retval.textColor = "black100"
      retval.borderColor = color("black15")
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
