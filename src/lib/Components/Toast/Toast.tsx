import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import useTimeoutFn from "react-use/lib/useTimeoutFn"
import { color, Flex, IconProps, Text, Touchable } from "palette"
import React from "react"
import { useToast } from "./toastHook"

export type ToastPlacement = "middle" | "top" | "bottom"
export interface ToastProps {
  id: string

  placement: ToastPlacement
  message: string

  onPress?: (id: string) => void
  Icon?: React.FC<IconProps>
}

export const Toast: React.FC<ToastProps> = ({ id, placement, message, onPress, Icon }) => {
  const { width, height } = useScreenDimensions()
  const { hide } = useToast()

  const [isReady, cancel, reset] = useTimeoutFn(() => {
    hide(id)
  }, 2000)


  if (placement === "middle") {
    const inner = (
      <Flex flex={1} alignItems="center" justifyContent="center">
        {Icon !== undefined ? <Icon fill="white100" width={45} height={45} /> : null}
        {/* if its not onPress, disable the touch ui feedback */}
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

  return (
    <Flex position="absolute" bottom={70 * parseInt(id)} backgroundColor="white">
      <Touchable onPress={() => onPress !== undefined && onPress(id)}>
        <Text> WOW {message} </Text>
      </Touchable>
    </Flex>
  )
}
