import React from "react"
import { TouchableHighlight, TouchableHighlightProps, TouchableWithoutFeedback } from "react-native"
import ContextMenu, { ContextMenuAction, ContextMenuProps } from "react-native-context-menu-view"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"

import { useColor } from "../../hooks"
import { Flex } from "../Flex"

interface ContextAction extends Omit<ContextMenuAction, "subtitletitle"> {
  onPress?: () => void
}

interface ExtraTouchableProps {
  flex?: number
  haptic?: HapticFeedbackTypes | true
  noFeedback?: boolean
  onLongPress?: ContextAction[] | TouchableHighlightProps["onLongPress"]
}

export type TouchableProps = Omit<TouchableHighlightProps, "onLongPress"> & ExtraTouchableProps

/**
 * `haptic` can be used like:
 * <Touchable haptic />
 * or
 * <Touchable haptic="impactHeavy" />
 */
export const Touchable: React.FC<TouchableProps> = ({
  children,
  flex,
  haptic,
  noFeedback,
  onPress,
  onLongPress,
  ...props
}) => {
  const color = useColor()
  const inner =
    React.Children.count(children) === 1 ? children : <Flex flex={flex}>{children}</Flex>

  const runHaptic = (pressFn: any | undefined) => {
    if (pressFn !== undefined && haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }
  }

  const onPressWrapped: TouchableHighlightProps["onPress"] = (e) => {
    runHaptic(onPress)
    onPress?.(e)
  }

  const onLongPressFnWrapped: TouchableHighlightProps["onLongPress"] = !isActions(onLongPress)
    ? (e) => {
        runHaptic(onLongPress)
        onLongPress?.(e)
      }
    : undefined

  const contextActions = isActions(onLongPress)
    ? onLongPress.map((action) => {
        const { onPress: ignored, ...rest } = action
        return { subtitletitle: "", ...rest }
      })
    : undefined

  const contextOnPress: ContextMenuProps["onPress"] = isActions(onLongPress)
    ? (e) => {
        const onPressToCall = onLongPress[e.nativeEvent.index].onPress

        runHaptic(onPressToCall)
        onPressToCall?.()
      }
    : undefined

  const InnerTouchable = () =>
    noFeedback ? (
      <TouchableWithoutFeedback
        {...props}
        onPress={onPressWrapped}
        onLongPress={onLongPressFnWrapped}
      >
        {inner}
      </TouchableWithoutFeedback>
    ) : (
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        {...props}
        onPress={onPressWrapped}
        onLongPress={onLongPressFnWrapped}
      >
        {inner}
      </TouchableHighlight>
    )

  return contextActions !== undefined ? (
    <ContextMenu actions={contextActions} onPress={contextOnPress}>
      <Flex borderWidth={1} borderColor="red">
        <InnerTouchable />
      </Flex>
    </ContextMenu>
  ) : (
    <InnerTouchable />
  )
}

const isActions = (longPressFn: TouchableProps["onLongPress"]): longPressFn is ContextAction[] =>
  Array.isArray(longPressFn)
