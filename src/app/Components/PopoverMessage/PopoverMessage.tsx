import { Flex, Box, useColor, Text, Touchable } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { Animated, StyleProp, ViewStyle } from "react-native"
import { usePopoverMessage } from "./popoverMessageHooks"

export const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const EDGE_POPOVER_MESSAGE_PADDING = 10
const NAVBAR_HEIGHT = 44

export type PopoverMessagePlacement = "top" | "bottom"
export type PopoverMessageType = "info" | "success" | "error" | "default"
export type PopoverMessageItem = Omit<
  PopoverMessageProps,
  "translateYAnimation" | "opacityAnimation"
>
export type PopoverMessagePointerType = "top" | "bottom"

export interface PopoverMessageProps {
  placement?: PopoverMessagePlacement
  title: string
  translateYAnimation: Animated.Value
  opacityAnimation: Animated.Value
  message?: string
  withPointer?: PopoverMessagePointerType
  autoHide?: boolean
  hideTimeout?: number
  style?: StyleProp<ViewStyle>
  type?: PopoverMessageType
  onPress?: () => void
  onUndoPress?: () => void
}

export const useColorsByType = (type?: PopoverMessageType) => {
  const color = useColor()

  if (type === "success") {
    return {
      descriptionColor: color("green10"),
      backgroundColor: color("green100"),
    }
  }

  if (type === "info") {
    return {
      descriptionColor: color("blue10"),
      backgroundColor: color("blue100"),
    }
  }

  if (type === "error") {
    return {
      descriptionColor: color("red10"),
      backgroundColor: color("red100"),
    }
  }

  return {
    descriptionColor: color("mono10"),
    backgroundColor: color("mono100"),
  }
}

// TODO: Remove NAVBAR_HEIGHT when a new design without a floating back button is added
export const PopoverMessage: React.FC<PopoverMessageProps> = (props) => {
  const {
    placement = "top",
    title,
    message,
    type,
    style,
    withPointer,
    translateYAnimation,
    opacityAnimation,
    onPress,
    onUndoPress,
  } = props
  const { safeAreaInsets } = useScreenDimensions()
  const { hide } = usePopoverMessage()
  const colors = useColorsByType(type)

  const handlePopoverMessagePress = () => {
    hide()
    onPress?.()
  }

  const handlePopoverMessageUndoPress = () => {
    hide()
    onUndoPress?.()
  }

  const range = [-150, 0]
  const outputRange = placement === "top" ? range : range.map((item) => item * -1)
  const translateY = translateYAnimation.interpolate({ inputRange: [0, 1], outputRange })
  const opacity = opacityAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })

  const Pointer = () => {
    return (
      <Flex
        width={0}
        height={0}
        backgroundColor="transparent"
        borderStyle="solid"
        alignSelf="center"
        borderLeftWidth={10}
        borderRightWidth={10}
        borderBottomWidth={12}
        borderLeftColor="transparent"
        borderRightColor="transparent"
        borderBottomColor="mono100"
        style={{
          transform: [{ rotate: rotatePointer({ pointerDirection: withPointer }).rotate }],
        }}
      />
    )
  }

  const content = (
    // @ts-ignore
    <Flex flexDirection={rotatePointer({ pointerDirection: withPointer }).flexDirection}>
      <Flex py={1} px={2} backgroundColor={colors.backgroundColor}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flex={1} mr={!!onUndoPress ? 1 : 0}>
            <Text color="mono0" variant="sm-display" textAlign={withPointer ? "center" : "left"}>
              {title}
            </Text>
            {!!message && (
              <Text color={colors.descriptionColor} variant="xs">
                {message}
              </Text>
            )}
          </Flex>
          {!!onUndoPress && (
            <Box>
              <Touchable
                accessibilityRole="button"
                noFeedback
                onPress={handlePopoverMessageUndoPress}
              >
                <Text
                  variant="xs"
                  color={colors.descriptionColor}
                  style={{ textDecorationLine: "underline" }}
                >
                  Undo
                </Text>
              </Touchable>
            </Box>
          )}
        </Flex>
      </Flex>
      {!!withPointer && <Pointer />}
    </Flex>
  )

  return (
    <AnimatedFlex
      position="absolute"
      left="1"
      right="1"
      bottom={
        placement === "bottom" ? safeAreaInsets.bottom + EDGE_POPOVER_MESSAGE_PADDING : undefined
      }
      top={
        placement === "top"
          ? safeAreaInsets.top + EDGE_POPOVER_MESSAGE_PADDING + NAVBAR_HEIGHT
          : undefined
      }
      style={[
        {
          opacity,
          transform: [{ translateY }],
          zIndex: 99999,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        style,
      ]}
    >
      {typeof onPress !== "undefined" ? (
        <Touchable accessibilityRole="button" noFeedback onPress={handlePopoverMessagePress}>
          {content}
        </Touchable>
      ) : (
        content
      )}
    </AnimatedFlex>
  )
}

const rotatePointer = ({ pointerDirection }: { pointerDirection?: PopoverMessagePointerType }) => {
  switch (pointerDirection) {
    case "bottom":
      return {
        rotate: "180deg",
        flexDirection: "column",
      }
    case "top":
    default:
      return {
        rotate: "0deg",
        flexDirection: "column-reverse",
      }
  }
}
