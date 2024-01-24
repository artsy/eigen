import { Box, Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { GlobalStore } from "app/store/GlobalStore"
import { useScreenDimensions } from "app/utils/hooks"
import { useEffect, useMemo, useState } from "react"
import { Animated } from "react-native"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { ToastDetails, ToastDuration } from "./types"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const MIDDLE_TOAST_SIZE = 120
const EDGE_TOAST_HEIGHT = 60
const IMAGE_SIZE = 40
const EDGE_TOAST_PADDING = 10
const NAVBAR_HEIGHT = 44
const TABBAR_HEIGHT = 50

export const TOAST_DURATION_MAP: Record<ToastDuration, number> = {
  short: 2500,
  long: 5000,
}

export const ToastComponent = ({
  id,
  positionIndex,
  placement,
  message,
  description,
  onPress,
  Icon,
  backgroundColor = "black100",
  duration = "short",
  cta,
  imageURL,
  bottomPadding,
}: ToastDetails) => {
  const toastDuration = TOAST_DURATION_MAP[duration]
  const color = useColor()
  const { width, height } = useScreenDimensions()
  const { top: topSafeAreaInset, bottom: bottomSafeAreaInset } =
    useScreenDimensions().safeAreaInsets
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
      duration: 450,
    }).start(() => GlobalStore.actions.toast.remove(id))
  }, toastDuration)

  const toastBottomPadding = useMemo(() => {
    // This is needed to avoid importing modules during tests
    if (__TEST__) {
      return TABBAR_HEIGHT
    }

    const { modules } = require("app/AppRegistry")

    const moduleName = __unsafe_mainModalStackRef.current?.getCurrentRoute()?.params // @ts-expect-error
      ?.moduleName as keyof typeof modules

    const isBottomTabHidden = modules[moduleName]?.options?.hidesBottomTabs

    // We currently handle custom bottom padding only for when the bottom tab bar is hidden
    // We can change this later if we need to handle custom bottom padding for when the bottom tab bar is visible
    if (isBottomTabHidden) {
      return bottomPadding || 0
    }

    return TABBAR_HEIGHT
  }, [])

  if (placement === "middle") {
    const innerMiddle = (
      <Flex flex={1} alignItems="center" justifyContent="center">
        {Icon !== undefined && <Icon fill="white100" width={45} height={45} />}
        <Text variant="xs" color="white100" textAlign="center" px={0.5}>
          {message}
        </Text>
      </Flex>
    )

    return (
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
        zIndex={999}
      >
        {onPress !== undefined ? (
          <Touchable
            style={{ flex: 1 }}
            onPress={() => onPress({ id, showActionSheetWithOptions })}
            underlayColor={color("black60")}
          >
            {innerMiddle}
          </Touchable>
        ) : (
          innerMiddle
        )}
      </AnimatedFlex>
    )
  }

  const innerTopBottom = (
    <Flex flex={1} justifyContent="center" m={1}>
      <Flex flexDirection="row" alignItems="flex-start">
        {Icon !== undefined ? <Icon fill="white100" width={25} height={25} mr={1} /> : null}

        {!!imageURL && (
          <Box borderWidth={1} borderColor="white100" mr={1}>
            <OpaqueImageView imageURL={imageURL} width={IMAGE_SIZE} height={IMAGE_SIZE} />
          </Box>
        )}

        <Flex flex={1}>
          <Text variant="sm-display" color="white100">
            {message}
          </Text>
        </Flex>

        {!!cta && (
          <Text variant="xs" color="white100" ml={1} underline>
            {cta}
          </Text>
        )}
      </Flex>

      {!!description && (
        <Flex flex={1} mt={0.5}>
          <Text variant="xs" color="white100">
            {description}
          </Text>
        </Flex>
      )}
    </Flex>
  )

  return (
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
          ? topSafeAreaInset +
            NAVBAR_HEIGHT +
            EDGE_TOAST_PADDING +
            positionIndex * (EDGE_TOAST_HEIGHT + EDGE_TOAST_PADDING)
          : undefined
      }
      backgroundColor={color(backgroundColor)}
      opacity={opacityAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
      overflow="hidden"
      zIndex={999}
    >
      {onPress !== undefined ? (
        <Touchable style={{ flex: 1 }} onPress={() => onPress({ id, showActionSheetWithOptions })}>
          {innerTopBottom}
        </Touchable>
      ) : (
        innerTopBottom
      )}
    </AnimatedFlex>
  )
}
