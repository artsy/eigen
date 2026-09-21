import { OwnerType, SentArtAssistantMessage } from "@artsy/cohesion"
import { CloseIcon, EditIcon } from "@artsy/icons/native"
import {
  Button,
  DEFAULT_HIT_SLOP,
  Dialog,
  Flex,
  Input,
  InputRef,
  Screen,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { FlashList, FlashListRef } from "@shopify/flash-list"
import { ArtAssistantEmptyState } from "app/Scenes/ArtAssistant/Components/ArtAssistantEmptyState"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/Components/ArtAssistantMessage"
import { useArtAssistantConversation } from "app/Scenes/ArtAssistant/hooks/useArtAssistantConversation"
import { ArtAssistantMessage as ArtAssistantMessageType } from "app/Scenes/ArtAssistant/types"
import { goBack } from "app/system/navigation/navigate"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useCallback, useEffect, useRef, useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const COMPOSER_LINE_HEIGHT = 20
const COMPOSER_COLLAPSED_HEIGHT = 50
const COMPOSER_VERTICAL_PADDING = (COMPOSER_COLLAPSED_HEIGHT - COMPOSER_LINE_HEIGHT) / 2
const COMPOSER_MAX_TEXT_HEIGHT = 4 * COMPOSER_LINE_HEIGHT

interface ArtAssistantProps {
  onClose?: () => void
}

export const ArtAssistant: React.FC<ArtAssistantProps> = ({ onClose = goBack }) => {
  const color = useColor()
  const space = useSpace()
  const { bottom } = useSafeAreaInsets()
  const [prompt, setPrompt] = useState("")
  const [isComposerFocused, setIsComposerFocused] = useState(false)
  const [isNewChatDialogVisible, setIsNewChatDialogVisible] = useState(false)
  const { isResponding, messages, startNewConversation, submit } = useArtAssistantConversation()
  const [messageHeights, setMessageHeights] = useState<Record<string, number>>({})
  const composerInputRef = useRef<InputRef>(null)
  const messageListRef = useRef<FlashListRef<ArtAssistantMessageType>>(null)
  const pendingScrollIndex = useRef<number | null>(null)
  const anchoredTurn = useRef<{ id: string; index: number } | null>(null)
  const messageListHeight = useRef(0)
  const composerKeyboardGap = space(1)
  const messageGap = space(2)
  const canSend = prompt.trim().length > 0 && !isResponding

  const dismissComposerKeyboard = () => {
    composerInputRef.current?.blur()
    KeyboardController.dismiss()
  }

  const handleScrollBeginDrag = () => {
    dismissComposerKeyboard()
  }

  const handleOpenNewChatDialog = () => {
    dismissComposerKeyboard()
    setIsNewChatDialogVisible(true)
  }

  const handleStartNewConversation = () => {
    setIsNewChatDialogVisible(false)
    pendingScrollIndex.current = null
    anchoredTurn.current = null
    setMessageHeights({})
    startNewConversation()
  }

  const handleMessageLayout = useCallback((messageID: string, height: number) => {
    setMessageHeights((heights) =>
      heights[messageID] === height ? heights : { ...heights, [messageID]: height }
    )
  }, [])

  const sendPrompt = (promptText: string, type: SentArtAssistantMessage["type"]) => {
    const text = promptText.trim()

    if (!text || isResponding) {
      return
    }

    const userMessageIndex = messages.length

    pendingScrollIndex.current = userMessageIndex
    void submit(text, { type })
    setPrompt("")
    dismissComposerKeyboard()
  }

  // A suggestion is sent the moment it is picked, so it never becomes a typed prompt.
  const handleSelectSuggestion = (suggestion: string) => {
    sendPrompt(suggestion, "suggestion")
  }

  const handleSend = () => {
    sendPrompt(prompt, "typed")
  }

  const scrollToPendingTurn = useCallback(() => {
    const index = pendingScrollIndex.current

    if (index === null) {
      return
    }

    pendingScrollIndex.current = null
    // Anchor the latest user turn after Thinking/final response layout changes, but do not
    // keep pulling the user down when artwork images load or while they read older messages.
    requestAnimationFrame(() => {
      messageListRef.current?.scrollToIndex({
        animated: true,
        index,
        viewOffset: composerKeyboardGap,
        viewPosition: 0,
      })
    })
    // `space` is a new function on every render, so the numeric gap is what keeps this callback
    // stable: an unstable identity would re-run the effect below on unrelated re-renders.
  }, [composerKeyboardGap])

  useEffect(() => {
    const lastMessage = messages.at(-1)

    if (lastMessage?.role !== "assistant" || lastMessage.phase === "responding") {
      return
    }

    const answerIndex = messages.length - 1
    const questionIndex = Math.max(0, answerIndex - 1)
    const questionHeight =
      questionIndex === answerIndex ? 0 : messageHeights[messages[questionIndex].id] ?? 0
    const turnHeight = questionHeight + messageGap + (messageHeights[lastMessage.id] ?? 0)
    // A turn taller than the list is anchored on the answer instead of the question, so the end
    // of the answer clears the composer.
    const turnFitsList = turnHeight + composerKeyboardGap <= messageListHeight.current
    const index = turnFitsList ? questionIndex : answerIndex
    const anchor = anchoredTurn.current

    // Only a turn that just became final earns an autoscroll. Focusing the composer or typing
    // re-renders the screen with the same messages, and those must not move the list.
    if (anchor?.id === lastMessage.id && anchor.index >= index) {
      return
    }

    anchoredTurn.current = { id: lastMessage.id, index }
    pendingScrollIndex.current = index
    requestAnimationFrame(scrollToPendingTurn)
  }, [composerKeyboardGap, messageGap, messageHeights, messages, scrollToPendingTurn])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.artAssistant })}
    >
      <Screen>
        <Screen.Header
          hideTitle
          hideLeftElements={messages.length === 0}
          leftElements={
            <Button
              accessibilityLabel="Start a new chat"
              icon={<EditIcon />}
              onPress={handleOpenNewChatDialog}
              size="small"
              variant="outline"
            >
              New
            </Button>
          }
          rightElements={
            <Touchable
              accessibilityLabel="Close Art Assistant"
              accessibilityRole="button"
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={() => onClose()}
              underlayColor="transparent"
            >
              <CloseIcon fill="mono100" />
            </Touchable>
          }
        />

        <KeyboardAvoidingContainer
          automaticOffset
          keyboardVerticalOffset={-bottom}
          testID="art-assistant-layout"
        >
          <FlashList
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: space(2),
              paddingVertical: space(2),
            }}
            data={messages}
            ref={messageListRef}
            keyExtractor={(message) => message.id}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <ArtAssistantEmptyState onSelectSuggestion={handleSelectSuggestion} />
            }
            onContentSizeChange={scrollToPendingTurn}
            onLayout={(event) => {
              messageListHeight.current = event.nativeEvent.layout.height
            }}
            onScrollBeginDrag={handleScrollBeginDrag}
            renderItem={({ item, index }) => (
              <Flex
                mb={index === messages.length - 1 ? 0 : 2}
                onLayout={(event) => handleMessageLayout(item.id, event.nativeEvent.layout.height)}
              >
                <ArtAssistantMessage message={item} />
              </Flex>
            )}
            style={{ flex: 1 }}
            testID="art-assistant-content"
          />

          <Flex backgroundColor="background" px={2} pt={1}>
            <Text variant="xs" color="mono60" textAlign="center">
              Art Assistant is AI and can make mistakes
            </Text>
          </Flex>

          <Flex
            flexDirection="row"
            alignItems="center"
            backgroundColor="background"
            gap={1}
            pb={`${bottom + composerKeyboardGap}px`}
            px={2}
            pt={1}
            testID="art-assistant-composer"
          >
            <Flex
              flex={1}
              borderColor={isComposerFocused ? "blue100" : "mono15"}
              borderRadius={COMPOSER_COLLAPSED_HEIGHT / 2}
              borderWidth={1}
              minHeight={COMPOSER_COLLAPSED_HEIGHT}
              justifyContent="center"
              px={2}
              py={`${COMPOSER_VERTICAL_PADDING}px`}
              testID="art-assistant-composer-input-container"
            >
              <Input
                accessibilityLabel="Art Assistant prompt"
                multiline
                onBlur={() => setIsComposerFocused(false)}
                onChangeText={setPrompt}
                onFocus={() => setIsComposerFocused(true)}
                placeholder="Tell us what you'd like..."
                placeholderTextColor={color("mono60")}
                ref={composerInputRef}
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
                value={prompt}
              />
            </Flex>

            <Touchable
              accessibilityLabel="Send"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              onPress={handleSend}
              style={{ borderRadius: 50, overflow: "hidden" }}
            >
              <Flex
                alignItems="center"
                backgroundColor={canSend ? "blue100" : "mono30"}
                borderRadius={50}
                height={50}
                justifyContent="center"
                px={2}
              >
                <Text variant="sm" color="mono0">
                  Send
                </Text>
              </Flex>
            </Touchable>
          </Flex>
        </KeyboardAvoidingContainer>

        <Dialog
          detail="Your current chat will be lost."
          isVisible={isNewChatDialogVisible}
          onBackgroundPress={() => setIsNewChatDialogVisible(false)}
          primaryCta={{
            text: "Start new chat",
            onPress: handleStartNewConversation,
          }}
          secondaryCta={{
            text: "Cancel",
            onPress: () => setIsNewChatDialogVisible(false),
          }}
          title="Start a new chat?"
        />
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
