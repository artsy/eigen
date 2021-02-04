import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { color, Flex, IconProps, Text, Touchable } from "palette"
import React from "react"
import { useToast } from "./toastHook"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type ToastPlacement = "middle" | "top" | "bottom"
export interface ToastProps {
  id: string
  positionIndex: number

  placement: ToastPlacement
  message: string

  onPress?: (id: string) => void
  Icon?: React.FC<IconProps>
}

export const Toast: React.FC<ToastProps> = ({ id, positionIndex, placement, message, onPress, Icon }) => {
  const { width, height } = useScreenDimensions()
  const { hide } = useToast()
  const { top: topSafeAreaInset } = useSafeAreaInsets()

  useTimeoutFn(() => {
    hide(id)
  }, 2500)


  if (placement === "middle") {
    const inner = (
      <Flex flex={1} alignItems="center" justifyContent="center">
        {Icon !== undefined ? <Icon fill="white100" width={45} height={45} /> : null}
        <Text variant="caption" color="white100">
          {message}
        </Text>
      </Flex>
    )

    return (
      <Flex
        width={120}
        height={120}
        position="absolute"
        top={(height - 120) / 2}
        left={(width - 120) / 2}
        backgroundColor={color("black100")}
        opacity={0.9}
        borderRadius={5}
        overflow="hidden"
      >
        {onPress !== undefined ? (
          <Touchable style={{ flex: 1 }} onPress={() => onPress(id)} underlayColor={color("black60")}>
            {inner}
          </Touchable>
        ) : (
          inner
        )}
      </Flex>
    )
  }

  const inner = (
    <Flex flex={1} flexDirection="row" alignItems="center" mx="2">
      {Icon !== undefined ? <Icon fill="white100" width={25} height={25} mr="1" /> : null}
      <Text variant="caption" color="white100">
        {message}
      </Text>
    </Flex>
  )

  return (
    <Flex
      position="absolute"
      left="1"
      right="1"
      height={60}
      bottom={placement === "bottom" ? 10 + positionIndex * (60 + 10) : undefined}
      top={placement === "top" ? topSafeAreaInset + 44 + 10 + positionIndex * (60 + 10) : undefined}
      backgroundColor={color("black100")}
      opacity={0.9}
      borderRadius={5}
      overflow="hidden"
    >
      {onPress !== undefined ? (
        <Touchable style={{ flex: 1 }} onPress={() => onPress(id)} underlayColor={color("black60")}>
          {inner}
        </Touchable>
      ) : (
        inner
      )}
    </Flex>
  )
}
