import { OwnerType, SentArtAssistantMessage } from "@artsy/cohesion"
import { CameraStrokeIcon, CloseIcon, EditIcon } from "@artsy/icons/native"
import {
  Button,
  DEFAULT_HIT_SLOP,
  Dialog,
  Flex,
  Image,
  InputRef,
  Screen,
  Spinner,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { FlashList, FlashListRef } from "@shopify/flash-list"
import {
  ArtAssistantComposer,
  ArtAssistantComposerAction,
  COMPOSER_ACTION_SIZE,
  COMPOSER_ICON_SIZE,
} from "app/Scenes/ArtAssistant/Components/ArtAssistantComposer"
import { ArtAssistantEmptyState } from "app/Scenes/ArtAssistant/Components/ArtAssistantEmptyState"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/Components/ArtAssistantMessage"
import { ArtAssistantVoiceInputButton } from "app/Scenes/ArtAssistant/Components/ArtAssistantVoiceInputButton"
import { useArtAssistantConversation } from "app/Scenes/ArtAssistant/hooks/useArtAssistantConversation"
import { useArtAssistantImageAttachment } from "app/Scenes/ArtAssistant/hooks/useArtAssistantImageAttachment"
import { useArtAssistantVoiceInput } from "app/Scenes/ArtAssistant/hooks/useArtAssistantVoiceInput"
import {
  ArtAssistantImage,
  ArtAssistantMessage as ArtAssistantMessageType,
} from "app/Scenes/ArtAssistant/types"
import { ArtAssistantErrorAction } from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useCallback, useEffect, useRef, useState } from "react"
import { KeyboardController } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ATTACHMENT_PREVIEW_SIZE = 56

interface ArtAssistantProps {
  initialPrompt?: string
  sendInitialPrompt?: boolean
  onClose?: () => void
}

export const ArtAssistant: React.FC<ArtAssistantProps> = ({
  initialPrompt,
  sendInitialPrompt,
  onClose = goBack,
}) => {
  const initialText = typeof initialPrompt === "string" ? initialPrompt : ""
  const shouldSendInitialPrompt = sendInitialPrompt === true
  const color = useColor()
  const space = useSpace()
  const { bottom } = useSafeAreaInsets()
  const [prompt, setPrompt] = useState(shouldSendInitialPrompt ? "" : initialText)
  const [isComposerFocused, setIsComposerFocused] = useState(false)
  const [isNewChatDialogVisible, setIsNewChatDialogVisible] = useState(false)
  const [dismissedErrorID, setDismissedErrorID] = useState<string | null>(null)
  const {
    isResponding,
    messages,
    rateMessage,
    retry,
    startNewConversation,
    submit,
    trackSuggestedReplyTapped,
    trackVoiceInputTapped,
  } = useArtAssistantConversation()
  const [messageHeights, setMessageHeights] = useState<Record<string, number>>({})
  const composerInputRef = useRef<InputRef>(null)
  const messageListRef = useRef<FlashListRef<ArtAssistantMessageType>>(null)
  const pendingScrollIndex = useRef<number | null>(null)
  const anchoredTurn = useRef<{ id: string; index: number } | null>(null)
  const messageListHeight = useRef(0)
  const didSendInitialPrompt = useRef(false)
  const enableImageSearch = useFeatureFlag("AREnableArtAssistantImageSearch")
  const { attachment, pick: pickImage, remove: removeImage } = useArtAssistantImageAttachment()
  const isUploadingImage = attachment?.status === "uploading"
  const attachedImage = attachment?.status === "ready" ? attachment.image : undefined
  const enableVoiceInput = useFeatureFlag("AREnableArtAssistantVoiceInput")
  // The composer text when dictation starts: the transcript is added after it, so the user can
  // type and then dictate, or dictate in several goes.
  const dictationPrefix = useRef("")
  const handleTranscript = useCallback((transcript: string) => {
    const prefix = dictationPrefix.current
    setPrompt(prefix ? `${prefix} ${transcript}` : transcript)
  }, [])
  const voiceInput = useArtAssistantVoiceInput(handleTranscript)
  const isListening = voiceInput.status !== "idle"
  const showVoiceInputButton = enableVoiceInput && voiceInput.isAvailable
  const composerKeyboardGap = space(1)
  const messageGap = space(2)
  // Until the user focuses it, dictates or has something to send, the composer stays a single row.
  const isComposerExpanded = isComposerFocused || isListening || prompt.length > 0 || !!attachment
  const canSend =
    (prompt.trim().length > 0 || !!attachedImage) && !isResponding && !isUploadingImage

  const dismissComposerKeyboard = () => {
    composerInputRef.current?.blur()
    KeyboardController.dismiss()
  }

  const handleScrollBeginDrag = () => {
    dismissComposerKeyboard()
  }

  const handleOpenNewChatDialog = () => {
    dismissComposerKeyboard()
    voiceInput.cancel()
    setIsNewChatDialogVisible(true)
  }

  const handleStartNewConversation = () => {
    setIsNewChatDialogVisible(false)
    pendingScrollIndex.current = null
    anchoredTurn.current = null
    setMessageHeights({})
    removeImage()
    voiceInput.cancel()
    startNewConversation()
  }

  const handleAddImage = () => {
    dismissComposerKeyboard()
    voiceInput.cancel()
    void pickImage()
  }

  const handleStartVoiceInput = () => {
    trackVoiceInputTapped("start")
    dictationPrefix.current = prompt.trimEnd()
    dismissComposerKeyboard()
    void voiceInput.start()
  }

  const handleStopVoiceInput = () => {
    trackVoiceInputTapped("stop")
    voiceInput.stop()
  }

  const handleMessageLayout = useCallback((messageID: string, height: number) => {
    setMessageHeights((heights) =>
      heights[messageID] === height ? heights : { ...heights, [messageID]: height }
    )
  }, [])

  const canSendPrompt = (promptText: string) =>
    !!promptText.trim() && !isResponding && !isUploadingImage

  const sendPrompt = (
    promptText: string,
    type: SentArtAssistantMessage["type"],
    image?: ArtAssistantImage
  ) => {
    if (isResponding || (!promptText.trim() && !image)) {
      return
    }

    const userMessageIndex = messages.length

    pendingScrollIndex.current = userMessageIndex
    void submit(promptText.trim(), { type, image })
    // A suggestion can be tapped mid-dictation; the rest of the transcript must not refill the
    // composer that was just cleared.
    voiceInput.cancel()
    setPrompt("")
    dismissComposerKeyboard()
  }

  // An uploaded image goes out with whatever is sent next, typed or tapped
  const sendPromptWithAttachedImage = (
    promptText: string,
    type: SentArtAssistantMessage["type"]
  ) => {
    sendPrompt(promptText, type, attachedImage)

    if (attachedImage) {
      removeImage()
    }
  }

  // A suggestion is sent the moment it is picked, so it never becomes a typed prompt.
  const handleSelectSuggestion = (suggestion: string) => {
    if (!canSendPrompt(suggestion)) {
      return
    }

    sendPromptWithAttachedImage(suggestion, "suggestion")
  }

  const handleSelectSuggestedReply = (
    reply: string,
    position: number,
    responseMessageID: string
  ) => {
    if (!canSendPrompt(reply)) {
      return
    }

    trackSuggestedReplyTapped(reply, position, responseMessageID)
    sendPromptWithAttachedImage(reply, "suggestion")
  }

  const handleSend = () => {
    if (!canSend) {
      return
    }

    sendPromptWithAttachedImage(prompt, "typed")
  }

  useEffect(() => {
    if (!shouldSendInitialPrompt || didSendInitialPrompt.current) {
      return
    }

    didSendInitialPrompt.current = true
    sendPrompt(initialText, "typed")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectErrorAction = (action: ArtAssistantErrorAction, messageID: string) => {
    switch (action) {
      case "retry":
        pendingScrollIndex.current = Math.max(0, messages.length - 2)
        retry()
        return
      case "dismiss":
        setDismissedErrorID(messageID)
        composerInputRef.current?.focus()
        return
      case "newChat":
        handleStartNewConversation()
        return
      case "close":
        onClose()
        return
    }
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
                <ArtAssistantMessage
                  message={item}
                  onRate={rateMessage}
                  onSelectSuggestedReply={
                    index === messages.length - 1 ? handleSelectSuggestedReply : undefined
                  }
                  onSelectErrorAction={
                    index === messages.length - 1 && item.id !== dismissedErrorID
                      ? (action) => handleSelectErrorAction(action, item.id)
                      : undefined
                  }
                />
              </Flex>
            )}
            style={{ flex: 1 }}
            testID="art-assistant-content"
          />

          <Flex
            backgroundColor="background"
            pb={`${bottom + composerKeyboardGap}px`}
            px={2}
            pt={1}
            testID="art-assistant-composer"
          >
            {!isComposerExpanded && (
              <Text variant="xs" color="mono60" pb={1} textAlign="center">
                Art Assistant is AI and can make mistakes
              </Text>
            )}

            <ArtAssistantComposer
              attachment={
                !!attachment && (
                  <Flex
                    alignSelf="flex-start"
                    backgroundColor="mono5"
                    borderRadius={10}
                    height={ATTACHMENT_PREVIEW_SIZE}
                    overflow="visible"
                    testID="art-assistant-image-attachment"
                    width={ATTACHMENT_PREVIEW_SIZE}
                  >
                    <Flex borderRadius={10} flex={1} overflow="hidden">
                      <Image
                        accessibilityLabel={isUploadingImage ? "Uploading image" : "Image to send"}
                        height={ATTACHMENT_PREVIEW_SIZE}
                        // A local file, so there is nothing for Gemini to resize.
                        performResize={false}
                        src={attachment.uri}
                        style={{ opacity: isUploadingImage ? 0.5 : 1 }}
                        width={ATTACHMENT_PREVIEW_SIZE}
                      />

                      {!!isUploadingImage && (
                        <Flex
                          alignItems="center"
                          bottom={0}
                          justifyContent="center"
                          left={0}
                          position="absolute"
                          right={0}
                          testID="art-assistant-image-uploading"
                          top={0}
                        >
                          <Spinner size="small" />
                        </Flex>
                      )}
                    </Flex>

                    <Touchable
                      accessibilityLabel="Remove image"
                      accessibilityRole="button"
                      hitSlop={DEFAULT_HIT_SLOP}
                      onPress={removeImage}
                      style={{ position: "absolute", top: space(0.5), right: space(0.5) }}
                    >
                      <Flex
                        alignItems="center"
                        backgroundColor="mono100"
                        borderRadius={10}
                        height={20}
                        justifyContent="center"
                        width={20}
                      >
                        <CloseIcon fill="mono0" height={12} width={12} />
                      </Flex>
                    </Touchable>
                  </Flex>
                )
              }
              canSend={canSend}
              // The transcript owns the text while listening, so typing would be overwritten.
              editable={!isListening}
              inputAccessibilityLabel="Art Assistant prompt"
              inputRef={composerInputRef}
              isExpanded={isComposerExpanded}
              isFocused={isComposerFocused}
              leadingActions={
                !!enableImageSearch && (
                  <ArtAssistantComposerAction
                    accessibilityLabel="Add an image"
                    isDisabled={isResponding}
                    onPress={handleAddImage}
                  >
                    <CameraStrokeIcon
                      fill={isResponding ? "mono30" : "mono100"}
                      height={COMPOSER_ICON_SIZE}
                      width={COMPOSER_ICON_SIZE}
                    />
                  </ArtAssistantComposerAction>
                )
              }
              onBlur={() => setIsComposerFocused(false)}
              onChangeText={setPrompt}
              onFocus={() => setIsComposerFocused(true)}
              onSend={handleSend}
              placeholder={isListening ? "Listening..." : "Tell us what you’d like..."}
              placeholderTextColor={color("mono60")}
              testID="art-assistant-composer-input-container"
              trailingActions={
                !!showVoiceInputButton && (
                  <ArtAssistantVoiceInputButton
                    isHearing={voiceInput.status === "listening"}
                    isListening={isListening}
                    onPress={isListening ? handleStopVoiceInput : handleStartVoiceInput}
                    size={COMPOSER_ACTION_SIZE}
                    volume={voiceInput.volume}
                  />
                )
              }
              value={prompt}
            />
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
