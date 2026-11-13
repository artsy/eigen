import { SendIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Input, InputRef, Touchable } from "@artsy/palette-mobile"
import React from "react"

// This component knows nothing about Art Assistant: everything it shows comes in through props
// and slots, so it can move to palette-mobile as is once the design is approved.

export const COMPOSER_ICON_SIZE = 20
export const COMPOSER_ACTION_SIZE = 36
const COMPOSER_LINE_HEIGHT = 20
const COMPOSER_MAX_TEXT_HEIGHT = 4 * COMPOSER_LINE_HEIGHT
const COMPOSER_BORDER_RADIUS = 12
const COMPOSER_PADDING = 8
// The gap between an action in the collapsed row and the text next to it.
const COMPOSER_ACTION_GAP = 8

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
  const isCollapsed = !isExpanded

  // Collapsed, the actions sit on top of the input row so that the input keeps its place in the
  // tree, and with it the focus, when the composer expands.
  const collapsedActionsProps = isCollapsed
    ? ({
        left: COMPOSER_PADDING,
        position: "absolute",
        right: COMPOSER_PADDING,
        top: COMPOSER_PADDING,
      } as const)
    : {}
  const collapsedTextInset = (hasActions: boolean) =>
    isCollapsed && hasActions ? COMPOSER_ACTION_SIZE + COMPOSER_ACTION_GAP : 0
  const textInset = isCollapsed ? (COMPOSER_ACTION_SIZE - COMPOSER_LINE_HEIGHT) / 2 : 0

  return (
    <Flex
      backgroundColor="mono5"
      borderColor={isFocused ? "mono30" : isCollapsed ? "transparent" : "mono10"}
      borderRadius={COMPOSER_BORDER_RADIUS}
      borderWidth={1}
      gap={1}
      p={`${COMPOSER_PADDING}px`}
      testID={testID}
    >
      {attachment}

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
          paddingBottom: textInset,
          paddingLeft: collapsedTextInset(!!leadingActions),
          paddingRight: collapsedTextInset(!!trailingActions),
          paddingTop: textInset,
        }}
        value={value}
      />

      <Flex
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        pointerEvents="box-none"
        {...collapsedActionsProps}
      >
        <Flex alignItems="center" flexDirection="row" gap={1}>
          {leadingActions}
        </Flex>

        <Flex alignItems="center" flexDirection="row" gap={1}>
          {trailingActions}

          {!!isExpanded && (
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
                <SendIcon fill="mono0" height={COMPOSER_ICON_SIZE} width={COMPOSER_ICON_SIZE} />
              </Flex>
            </Touchable>
          )}
        </Flex>
      </Flex>
    </Flex>
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
