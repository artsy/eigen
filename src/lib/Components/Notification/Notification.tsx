import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, CloseIcon, Color, color, Flex, Text, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Platform } from "react-native"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { useNotification } from "./notificationHooks"

export const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const EDGE_NOTIFICATION_HEIGHT = Platform.OS === "ios" ? 80 : 90
const EDGE_NOTIFICATION_PADDING = 10
const FRICTION = 20
const NAVBAR_HEIGHT = 44

export type NotificationPlacement = "top" | "bottom"
export type NotificationType = "info" | "success" | "default"
export type NotificationOptions = Omit<NotificationProps, "id" | "positionIndex">

export const getTitleColorByType = (type?: NotificationType): Color => {
  if (type === "success") {
    return "green100"
  } else if (type === "info") {
    return "blue100"
  }

  return "black100"
}

export interface NotificationProps {
  id: string
  positionIndex: number
  placement: NotificationPlacement
  title: string
  message?: string
  autoHide?: boolean
  hideTimeout?: number
  showCloseIcon?: boolean
  type?: NotificationType
  onPress?: () => void
  onClose?: () => void
}

// TODO: Remove NAVBAR_HEIGHT when a new design without a floating back button is added
export const Notification: React.FC<NotificationProps> = (props) => {
  const {
    id,
    positionIndex,
    placement,
    title,
    message,
    autoHide = true,
    hideTimeout = 3500,
    showCloseIcon = true,
    type,
    onPress,
    onClose,
  } = props
  const { safeAreaInsets } = useScreenDimensions()
  const { hide } = useNotification()
  const [opacityAnim] = useState(new Animated.Value(0))
  const [translateYAnim] = useState(new Animated.Value(0))
  const isClosed = useRef<boolean>(false)
  const titleColor = getTitleColorByType(type)

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateYAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: FRICTION,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 450,
      }),
    ]).start()
  }, [])

  const hideAnimation = () => {
    isClosed.current = true
    Animated.parallel([
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: FRICTION,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 250,
      }),
    ]).start(() => hide(id))
  }

  const handleNotificationPress = () => {
    hideAnimation()
    onPress?.()
  }

  const handleNotificationClosePress = () => {
    hideAnimation()
    onClose?.()
  }

  useTimeoutFn(() => {
    if (autoHide && !isClosed.current) {
      hideAnimation()
    }
  }, hideTimeout)

  const range = [-EDGE_NOTIFICATION_HEIGHT, 0]
  const outputRange = placement === "top" ? range : range.map((item) => item * -1)
  const translateY = translateYAnim.interpolate({ inputRange: [0, 1], outputRange })
  const opacity = opacityAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
  const offset = EDGE_NOTIFICATION_PADDING + positionIndex * (EDGE_NOTIFICATION_HEIGHT + EDGE_NOTIFICATION_PADDING)

  const content = (
    <Flex p={1}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flex={1}>
          <Text color={titleColor} variant="subtitle">
            {title}
          </Text>
        </Flex>
        {!!showCloseIcon && (
          <Box mt={0.25}>
            <Touchable onPress={handleNotificationClosePress}>
              <CloseIcon />
            </Touchable>
          </Box>
        )}
      </Flex>
      {!!message && (
        <Text numberOfLines={2} mt={0.5} color="black60" variant="small">
          {message}
        </Text>
      )}
    </Flex>
  )

  return (
    <AnimatedFlex
      position="absolute"
      left="1"
      right="1"
      height={EDGE_NOTIFICATION_HEIGHT}
      bottom={placement === "bottom" ? safeAreaInsets.bottom + offset : undefined}
      top={placement === "top" ? safeAreaInsets.top + offset + NAVBAR_HEIGHT : undefined}
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
        <Touchable noFeedback onPress={handleNotificationPress}>
          {content}
        </Touchable>
      ) : (
        content
      )}
    </AnimatedFlex>
  )
}
