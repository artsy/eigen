import { Box, Flex, Image, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { isModalScreen } from "app/Navigation/utils/isModalScreen"
import { modules } from "app/Navigation/utils/modules"
import { GlobalStore } from "app/store/GlobalStore"
import { useScreenDimensions } from "app/utils/hooks"
import { Fragment, useEffect, useMemo, useState } from "react"
import { Animated, Platform } from "react-native"
import { FullWindowOverlay } from "react-native-screens"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { ToastDetails, ToastDuration } from "./types"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const MIDDLE_TOAST_SIZE = 120
const EDGE_TOAST_HEIGHT = 60
const IMAGE_SIZE = 40
const EDGE_TOAST_PADDING = 10
const NAVBAR_HEIGHT = 44
const TOAST_ANIMATION_DURATION = 450

// Keeps the middle toast above modals on iOS. On Android FullWindowOverlay is a plain View laid out
// after the app, below the screen, which hid the toast, so the toast renders directly there instead
const MiddleToastOverlay = Platform.OS === "ios" ? FullWindowOverlay : Fragment

export const TOAST_DURATION_MAP: Record<ToastDuration, number> = {
  short: 2500,
  long: 5000,
  superLong: 10000,
}

export const ToastComponent = ({
  id,
  positionIndex,
  placement,
  message,
  description,
  onPress,
  hideOnPress,
  Icon,
  backgroundColor = "mono100",
  duration = "short",
  cta,
  imageURL,
  bottomPadding,
}: ToastDetails) => {
  const toastDuration = TOAST_DURATION_MAP[duration]
  const color = useColor()
  const { width, height } = useScreenDimensions()
  const { bottom: bottomSafeAreaInset } = useScreenDimensions().safeAreaInsets
  const [opacityAnim] = useState(new Animated.Value(0))

  const { showActionSheetWithOptions } = useActionSheet()

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      useNativeDriver: true,
      duration: 150,
    }).start()
  }, [])

  useTimeoutFn(() => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: TOAST_ANIMATION_DURATION,
    }).start(() => GlobalStore.actions.toast.remove(id))
  }, toastDuration)

  const toastBottomPadding = useMemo(() => {
    // This is needed to avoid importing modules during tests
    if (__TEST__) {
      return BOTTOM_TABS_HEIGHT
    }

    const moduleName = internal_navigationRef?.current?.getCurrentRoute()
      ?.name as keyof typeof modules

    const module = modules[moduleName]

    // We currently handle custom bottom padding only for when the bottom tab bar is hidden
    // We can change this later if we need to handle custom bottom padding for when the bottom tab bar is visible
    if (module?.options?.hidesBottomTabs) {
      return bottomPadding || 0
    }

    // Modal screens have no tab bar either, so a toast that brings its own padding uses it there
    if (module && isModalScreen(module) && bottomPadding != null) {
      return bottomPadding
    }

    return BOTTOM_TABS_HEIGHT
  }, [])

  // Modal routes open as native modals on iOS, which cover a top or bottom toast rendered in the app
  const EdgeToastOverlay = useMemo(() => {
    if (__TEST__ || Platform.OS !== "ios") {
      return Fragment
    }

    const moduleName = internal_navigationRef?.current?.getCurrentRoute()
      ?.name as keyof typeof modules
    const module = modules[moduleName]

    return module && isModalScreen(module) ? FullWindowOverlay : Fragment
  }, [])

  if (placement === "middle") {
    const innerMiddle = (
      <Flex flex={1} alignItems="center" justifyContent="center">
        {Icon !== undefined && <Icon fill="mono0" width={45} height={45} />}
        <Text variant="xs" color="mono0" textAlign="center" px={0.5}>
          {message}
        </Text>
      </Flex>
    )

    return (
      <MiddleToastOverlay>
        <AnimatedFlex
          width={MIDDLE_TOAST_SIZE}
          height={MIDDLE_TOAST_SIZE}
          position="absolute"
          top={(height - MIDDLE_TOAST_SIZE) / 2}
          left={(width - MIDDLE_TOAST_SIZE) / 2}
          backgroundColor={color(backgroundColor)}
          opacity={opacityAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] })}
          borderRadius={6}
          overflow="hidden"
          zIndex={9999999}
        >
          {onPress !== undefined ? (
            <Touchable
              accessibilityRole="button"
              style={{ flex: 1 }}
              onPress={() => onPress({ id, showActionSheetWithOptions })}
              underlayColor={color("mono60")}
            >
              {innerMiddle}
            </Touchable>
          ) : (
            innerMiddle
          )}
        </AnimatedFlex>
      </MiddleToastOverlay>
    )
  }

  const innerTopBottom = (
    <Flex flex={1} justifyContent="center" m={1}>
      <Flex flexDirection="row" alignItems="flex-start">
        {Icon !== undefined ? <Icon fill="mono0" width={25} height={25} mr={1} /> : null}

        {!!imageURL && (
          <Box borderWidth={1} borderColor="mono0" mr={1}>
            <Image src={imageURL} width={IMAGE_SIZE} height={IMAGE_SIZE} />
          </Box>
        )}

        <Flex flex={1}>
          <Text variant="sm-display" color="mono0">
            {message}
          </Text>
        </Flex>

        {!!cta && (
          <Text variant="xs" color="mono0" ml={1} underline>
            {cta}
          </Text>
        )}
      </Flex>

      {!!description && (
        <Flex flex={1} mt={0.5}>
          <Text variant="xs" color="mono0">
            {description}
          </Text>
        </Flex>
      )}
    </Flex>
  )

  return (
    <EdgeToastOverlay>
      <AnimatedFlex
        position="absolute"
        left="1"
        right="1"
        minHeight={EDGE_TOAST_HEIGHT}
        bottom={
          placement === "bottom"
            ? bottomSafeAreaInset +
              toastBottomPadding +
              EDGE_TOAST_PADDING +
              positionIndex * (EDGE_TOAST_HEIGHT + EDGE_TOAST_PADDING)
            : undefined
        }
        top={
          placement === "top"
            ? NAVBAR_HEIGHT +
              EDGE_TOAST_PADDING +
              positionIndex * (EDGE_TOAST_HEIGHT + EDGE_TOAST_PADDING)
            : undefined
        }
        backgroundColor={color(backgroundColor)}
        borderRadius={5}
        opacity={opacityAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
        overflow="hidden"
        zIndex={999}
      >
        {onPress !== undefined ? (
          <Touchable
            accessibilityRole="button"
            style={{ flex: 1 }}
            onPress={() => {
              onPress?.({ id, showActionSheetWithOptions })

              if (hideOnPress) {
                Animated.timing(opacityAnim, {
                  toValue: 0,
                  useNativeDriver: true,
                  duration: TOAST_ANIMATION_DURATION,
                }).start(() => GlobalStore.actions.toast.remove(id))
              }
            }}
          >
            {innerTopBottom}
          </Touchable>
        ) : (
          innerTopBottom
        )}
      </AnimatedFlex>
    </EdgeToastOverlay>
  )
}
