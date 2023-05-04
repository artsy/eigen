import { Flex, useColor } from "@artsy/palette-mobile"
import { omit } from "lodash"
import React from "react"
import { TouchableHighlight, TouchableHighlightProps } from "react-native"
import ContextMenu, { ContextMenuAction, ContextMenuProps } from "react-native-context-menu-view"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"

interface ContextAction extends Omit<ContextMenuAction, "subtitle"> {
  onPress?: () => void
}

interface ExtraTouchableProps {
  flex?: number
  /**
   * `haptic` can be used like:
   *  `<ContextMenuArtwork haptic />`
   * or
   * `<ContextMenuArtwork haptic="impactHeavy" />`
   */
  haptic?: HapticFeedbackTypes | true
  onLongPress?: ContextAction[] | TouchableHighlightProps["onLongPress"]
}

export type ContextMenuArtworkProps = Omit<TouchableHighlightProps, "onLongPress"> &
  ExtraTouchableProps

export const ContextMenuArtwork: React.FC<ContextMenuArtworkProps> = ({
  children,
  flex,
  haptic,
  onPress,
  onLongPress,
  ...props
}) => {
  const color = useColor()
  const inner =
    React.Children.count(children) === 1 ? children : <Flex flex={flex}>{children}</Flex>

  const triggerHaptic = () => {
    if (!haptic) return

    Haptic.trigger(haptic === true ? "impactLight" : haptic)
  }

  const handlePress: TouchableHighlightProps["onPress"] = (event) => {
    triggerHaptic()
    onPress?.(event)
  }

  const handleLongPress: TouchableHighlightProps["onLongPress"] = (event) => {
    if (isActions(onLongPress)) return

    triggerHaptic()
    onLongPress?.(event)
  }

  const getContextActions = () => {
    if (!isActions(onLongPress)) return

    const contextActions = onLongPress.map((action) => {
      return {
        ...omit(action, "onPress"),
        subtitle: "",
      }
    })

    return contextActions
  }

  const handleContextOnPress: ContextMenuProps["onPress"] = (event) => {
    if (!isActions(onLongPress)) return

    const onPressToCall = onLongPress[event.nativeEvent.index].onPress

    triggerHaptic()
    onPressToCall?.()
  }

  const contextActions = getContextActions()

  if (contextActions !== undefined) {
    return (
      <ContextMenu actions={contextActions} onPress={handleContextOnPress}>
        <TouchableHighlight
          underlayColor={color("white100")}
          activeOpacity={0.8}
          {...props}
          onPress={handlePress}
          onLongPress={handleLongPress}
        >
          {inner}
        </TouchableHighlight>
      </ContextMenu>
    )
  }

  return (
    <TouchableHighlight
      underlayColor={color("white100")}
      activeOpacity={0.8}
      {...props}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      {inner}
    </TouchableHighlight>
  )
}

const isActions = (
  longPressFn: ContextMenuArtworkProps["onLongPress"]
): longPressFn is ContextAction[] => Array.isArray(longPressFn)
