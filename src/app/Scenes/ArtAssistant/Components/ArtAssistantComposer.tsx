import { SendIcon } from "@artsy/icons/native"
import {
  DEFAULT_HIT_SLOP,
  Flex,
  Input,
  InputRef,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import React, { useEffect, useRef } from "react"
import { LayoutChangeEvent, StyleSheet } from "react-native"
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

// This component knows nothing about Art Assistant: everything it shows comes in through props
// and slots, so it can move to palette-mobile as is once the design is approved.

/** The size of an 18×18 icon, e.g. the camera, in a composer action. */
export const COMPOSER_ICON_SIZE = 24
export const COMPOSER_ACTION_SIZE = 40
// The arrow fills its whole box, unlike the 18×18 icons, so it needs a smaller one to match them.
const COMPOSER_SEND_ICON_SIZE = 15
// The line height of the text the Input renders (`sm-display`), so the rows line up with it.
const COMPOSER_LINE_HEIGHT = parseInt(THEME.textVariants["sm-display"].lineHeight, 10)
const COMPOSER_MAX_TEXT_HEIGHT = 4 * COMPOSER_LINE_HEIGHT
const COMPOSER_BORDER_RADIUS = 8
const COMPOSER_BORDER_WIDTH = 1
const COMPOSER_ANIMATION_DURATION = 200
/** How the composer eases between its states, for anything that moves along with it. */
export const COMPOSER_TIMING = {
  duration: COMPOSER_ANIMATION_DURATION,
  easing: Easing.out(Easing.cubic),
}

interface ArtAssistantComposerProps {
  /** Shown above the text, e.g. a preview of an attached image. */
  attachment?: React.ReactNode
  canSend: boolean
  editable?: boolean
  /**
   * Whether the composer shows the text above the actions, e.g. while it has focus or has
   * something to send. Collapsed, it is a single row: leading actions, the input and the trailing
   * actions.
   */
  isExpanded: boolean
  isFocused: boolean
  inputAccessibilityLabel?: string
  inputRef?: React.Ref<InputRef>
  /** Actions on the left of the bottom row, e.g. adding an image. */
  leadingActions?: React.ReactNode
  onBlur: () => void
  onChangeText: (text: string) => void
  onFocus: () => void
  onSend: () => void
  placeholder?: string
  placeholderTextColor?: string
  testID?: string
  /** Actions on the right of the bottom row, next to Send, e.g. dictation. */
  trailingActions?: React.ReactNode
  value: string
}

export const ArtAssistantComposer: React.FC<ArtAssistantComposerProps> = ({
  attachment,
  canSend,
  editable = true,
  isExpanded,
  isFocused,
  inputAccessibilityLabel,
  inputRef,
  leadingActions,
  onBlur,
  onChangeText,
  onFocus,
  onSend,
  placeholder,
  placeholderTextColor,
  testID,
  trailingActions,
  value,
}) => {
  const color = useColor()
  const space = useSpace()
  const isCollapsed = !isExpanded
  const padding = space(1)

  const collapsedHeight = COMPOSER_ACTION_SIZE + 2 * padding
  // Collapsed, the text sits between the actions, in the middle of the row: across the actions
  // and down from its place above them.
  const leadingInset = leadingActions ? COMPOSER_ACTION_SIZE + space(0.5) : 0
  const trailingInset = trailingActions ? COMPOSER_ACTION_SIZE + space(0.5) : 0
  const collapsedTextOffset = COMPOSER_ACTION_SIZE / 2 + padding + COMPOSER_LINE_HEIGHT / 2
  // Collapsed, the border takes the background color: easing from `transparent` would pass
  // through a dark grey.
  const borderColor = color(isFocused ? "mono30" : isCollapsed ? "mono5" : "mono10")
  // Collapsed, the composer is a pill.
  const borderRadius = isCollapsed ? COMPOSER_ACTION_SIZE / 2 + padding : COMPOSER_BORDER_RADIUS

  // Nothing here uses layout transitions: they get stuck when the composer changes behind
  // something else, e.g. the image picker. Instead, the content is always laid out expanded and
  // held to the bottom edge, like the actions, and the container eases its height between a
  // single row and the whole content. While it grows, its top edge uncovers the content in place.
  const height = useSharedValue(collapsedHeight)
  const contentHeight = useRef<number | null>(null)
  const animateHeight = (nextHeight: number) => height.set(withTiming(nextHeight, COMPOSER_TIMING))

  // Expanding starts as soon as it renders, without waiting for the content to be measured again.
  useEffect(() => {
    if (contentHeight.current !== null) {
      animateHeight(isExpanded ? contentHeight.current : collapsedHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded])

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height
    // Held to the bottom edge, the content moves on every frame of the height animation, and each
    // move is a layout event. Only a new height matters: easing again towards the same one would
    // start the animation over.
    if (nextHeight === contentHeight.current) {
      return
    }

    const isFirstLayout = contentHeight.current === null
    contentHeight.current = nextHeight

    if (isFirstLayout && isExpanded) {
      height.set(contentHeight.current)
    } else if (!isFirstLayout && isExpanded) {
      animateHeight(contentHeight.current)
    }
  }

  const heightAnimatedStyle = useAnimatedStyle(() => ({ height: height.get() }))
  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(borderColor, COMPOSER_TIMING),
    borderRadius: withTiming(borderRadius, COMPOSER_TIMING),
  }))
  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(isCollapsed ? leadingInset : 0, COMPOSER_TIMING) },
      { translateY: withTiming(isCollapsed ? collapsedTextOffset : 0, COMPOSER_TIMING) },
    ],
  }))
  const sendAnimatedStyle = useAnimatedStyle(() => ({
    width: withTiming(isExpanded ? padding + COMPOSER_ACTION_SIZE : 0, COMPOSER_TIMING),
  }))

  return (
    <Animated.View style={heightAnimatedStyle} testID={testID}>
      {/* The border sits on its own view: on the view whose height animates, every frame of the
          height would put the border back as it was before the animation. */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: color("mono5"), borderWidth: COMPOSER_BORDER_WIDTH },
          borderAnimatedStyle,
        ]}
      />

      {/* The content lays out at once, while the container takes a few frames to catch up with
          it, e.g. right after an image is picked. Clipped, it never spills out of the border. The
          actions stay outside, so that the dictation rings can spread past it. */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "flex-end", overflow: "hidden" },
          borderAnimatedStyle,
        ]}
      >
        <Flex gap={1} onLayout={handleContentLayout} p={1}>
          {attachment}

          <Animated.View
            style={[
              // Collapsed, the text leaves room for the actions on both sides.
              { paddingRight: isCollapsed ? leadingInset + trailingInset : 0 },
              textAnimatedStyle,
            ]}
          >
            <Input
              accessibilityLabel={inputAccessibilityLabel}
              editable={editable}
              multiline
              onBlur={onBlur}
              onChangeText={onChangeText}
              onFocus={onFocus}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              ref={inputRef}
              style={{
                borderWidth: 0,
                height: undefined,
                maxHeight: COMPOSER_MAX_TEXT_HEIGHT,
                minHeight: COMPOSER_LINE_HEIGHT,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
              }}
              value={value}
            />
          </Animated.View>

          {/* The row of the actions, which sit on top of it. */}
          <Flex height={COMPOSER_ACTION_SIZE} />
        </Flex>
      </Animated.View>

      <Flex
        alignItems="center"
        bottom={padding}
        flexDirection="row"
        justifyContent="space-between"
        left={padding}
        pointerEvents="box-none"
        position="absolute"
        right={padding}
      >
        <Flex alignItems="center" flexDirection="row" gap={1}>
          {leadingActions}
        </Flex>

        <Flex alignItems="center" flexDirection="row">
          {trailingActions}

          {/* Opens up the room for Send, which moves the trailing actions aside. */}
          <Animated.View
            style={[{ alignItems: "flex-end", overflow: "hidden" }, sendAnimatedStyle]}
          >
            {!!isExpanded && (
              <Animated.View entering={FadeIn.duration(COMPOSER_ANIMATION_DURATION)}>
                <Touchable
                  accessibilityLabel="Send"
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canSend }}
                  disabled={!canSend}
                  onPress={onSend}
                  underlayColor="transparent"
                >
                  <Flex
                    alignItems="center"
                    backgroundColor={canSend ? "mono100" : "mono30"}
                    borderRadius={COMPOSER_ACTION_SIZE / 2}
                    height={COMPOSER_ACTION_SIZE}
                    justifyContent="center"
                    width={COMPOSER_ACTION_SIZE}
                  >
                    <SendIcon
                      fill="mono0"
                      height={COMPOSER_SEND_ICON_SIZE}
                      width={COMPOSER_SEND_ICON_SIZE}
                    />
                  </Flex>
                </Touchable>
              </Animated.View>
            )}
          </Animated.View>
        </Flex>
      </Flex>
    </Animated.View>
  )
}

interface ArtAssistantComposerActionProps {
  accessibilityLabel: string
  children: React.ReactNode
  isDisabled?: boolean
  onPress: () => void
}

/** A round, grey action for the composer's bottom row. */
export const ArtAssistantComposerAction: React.FC<ArtAssistantComposerActionProps> = ({
  accessibilityLabel,
  children,
  isDisabled,
  onPress,
}) => (
  <Touchable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    accessibilityState={{ disabled: !!isDisabled }}
    disabled={isDisabled}
    hitSlop={DEFAULT_HIT_SLOP}
    onPress={onPress}
    underlayColor="transparent"
  >
    <Flex
      alignItems="center"
      backgroundColor="mono10"
      borderRadius={COMPOSER_ACTION_SIZE / 2}
      height={COMPOSER_ACTION_SIZE}
      justifyContent="center"
      width={COMPOSER_ACTION_SIZE}
    >
      {children}
    </Flex>
  </Touchable>
)
