import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, CloseIcon, Color, color, Flex, Text, Touchable } from "palette"
import React from "react"
import { Animated } from "react-native"
import { usePopoverMessage } from "./popoverMessageHooks"

export const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const EDGE_POPOVER_MESSAGE_PADDING = 10
const NAVBAR_HEIGHT = 44

export type PopoverMessagePlacement = "top" | "bottom"
export type PopoverMessageType = "info" | "success" | "error" | "default"
export type PopoverMessageItem = Omit<PopoverMessageProps, "translateYAnimation" | "opacityAnimation">

export interface PopoverMessageProps {
  placement?: PopoverMessagePlacement
  title: string
  translateYAnimation: Animated.Value
  opacityAnimation: Animated.Value
  message?: string
  autoHide?: boolean
  hideTimeout?: number
  showCloseIcon?: boolean
  type?: PopoverMessageType
  onPress?: () => void
  onClose?: () => void
}

export const getTitleColorByType = (type?: PopoverMessageType): Color => {
  if (type === "success") {
    return "green100"
  } else if (type === "info") {
    return "blue100"
  } else if (type === "error") {
    return "red100"
  }

  return "black100"
}

// TODO: Remove NAVBAR_HEIGHT when a new design without a floating back button is added
export const PopoverMessage: React.FC<PopoverMessageProps> = (props) => {
  const {
    placement = "top",
    title,
    message,
    showCloseIcon = true,
    type,
    translateYAnimation,
    opacityAnimation,
    onPress,
    onClose,
  } = props
  const { safeAreaInsets } = useScreenDimensions()
  const { hide } = usePopoverMessage()
  const titleColor = getTitleColorByType(type)

  const handlePopoverMessagePress = () => {
    hide()
    onPress?.()
  }

  const handlePopoverMessageClosePress = () => {
    hide()
    onClose?.()
  }

  const range = [-150, 0]
  const outputRange = placement === "top" ? range : range.map((item) => item * -1)
  const translateY = translateYAnimation.interpolate({ inputRange: [0, 1], outputRange })
  const opacity = opacityAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  const content = (
    <Flex p={1}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flex={1} mr={!!showCloseIcon ? 1 : 0}>
          <Text color={titleColor} variant="subtitle" numberOfLines={1}>
            {title}
          </Text>
          {!!message && (
            <Text color="black60" variant="small">
              {message}
            </Text>
          )}
        </Flex>
        {!!showCloseIcon && (
          <Box mt={0.25}>
            <Touchable onPress={handlePopoverMessageClosePress}>
              <CloseIcon />
            </Touchable>
          </Box>
        )}
      </Flex>
    </Flex>
  )

  return (
    <AnimatedFlex
      position="absolute"
      left="1"
      right="1"
      bottom={placement === "bottom" ? safeAreaInsets.bottom + EDGE_POPOVER_MESSAGE_PADDING : undefined}
      top={placement === "top" ? safeAreaInsets.top + EDGE_POPOVER_MESSAGE_PADDING + NAVBAR_HEIGHT : undefined}
      style={{
        opacity,
        transform: [{ translateY }],
        zIndex: 99999,
        borderColor: "#F7F7F7",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 5,
      }}
      backgroundColor={color("white100")}
    >
      {typeof onPress !== "undefined" ? (
        <Touchable noFeedback onPress={handlePopoverMessagePress}>
          {content}
        </Touchable>
      ) : (
        content
      )}
    </AnimatedFlex>
  )
}
