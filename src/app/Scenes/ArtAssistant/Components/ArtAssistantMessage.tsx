import { Flex, Image, Spacer, Text } from "@artsy/palette-mobile"
import { ArtAssistantErrorActions } from "app/Scenes/ArtAssistant/Components/ArtAssistantErrorActions"
import { ArtAssistantResponseSection } from "app/Scenes/ArtAssistant/Components/ArtAssistantResponseSection"
import { ArtAssistantSuggestedReplies } from "app/Scenes/ArtAssistant/Components/ArtAssistantSuggestedReplies"
import { ArtAssistantMessage as ArtAssistantMessageType } from "app/Scenes/ArtAssistant/types"
import { ArtAssistantErrorAction } from "app/Scenes/ArtAssistant/utils/artAssistantErrors"

const ATTACHED_IMAGE_SIZE = 120

interface ArtAssistantMessageProps {
  message: ArtAssistantMessageType
  /** Only passed for the latest answer, so older turns don't offer replies */
  onSelectSuggestedReply?: (reply: string, position: number, responseMessageID: string) => void
  /** Only passed for the latest answer, since acting on an older failure makes no sense */
  onSelectErrorAction?: (action: ArtAssistantErrorAction) => void
}

export const ArtAssistantMessage: React.FC<ArtAssistantMessageProps> = ({
  message,
  onSelectSuggestedReply,
  onSelectErrorAction,
}) => {
  const isUser = message.role === "user"
  const attachedImage = message.role === "user" ? message.image : undefined
  const suggestedReplies =
    message.role === "assistant" && message.phase === "complete"
      ? message.suggestedReplies ?? []
      : []
  const hasAssistantSuggestedReplies = !!onSelectSuggestedReply && suggestedReplies.length > 0

  if (message.role === "assistant" && message.phase === "responding") {
    return <ArtAssistantActivityStatus text={message.activity ?? "Thinking..."} />
  }

  return (
    <Flex alignItems={isUser ? "flex-end" : "flex-start"}>
      {!!attachedImage && (
        <Image
          accessibilityLabel="Attached image"
          height={ATTACHED_IMAGE_SIZE}
          performResize={false}
          src={attachedImage.uri}
          style={{ borderRadius: 10 }}
          testID="art-assistant-attached-image"
          width={ATTACHED_IMAGE_SIZE}
        />
      )}

      {!!attachedImage && !!message.text && <Spacer y={1} />}

      {/* An image-only message has no text, and an empty bubble would read as a glitch. */}
      {(!isUser || !!message.text) && (
        <Flex
          alignSelf={isUser ? "flex-end" : "flex-start"}
          backgroundColor={isUser ? "mono100" : "mono10"}
          borderRadius={15}
          maxWidth="75%"
          px={1}
          py={1}
          testID={`art-assistant-${message.role}-message`}
        >
          <Text color={isUser ? "mono0" : "mono100"} variant="sm">
            {message.text}
          </Text>
        </Flex>
      )}

      {message.role === "assistant" &&
        message.sections?.map((section, index) => (
          <Flex alignSelf="stretch" key={`${message.id}:${index}`} mt={1} mx={-2}>
            <ArtAssistantResponseSection section={section} />
          </Flex>
        ))}

      {!!hasAssistantSuggestedReplies && (
        <ArtAssistantSuggestedReplies
          replies={suggestedReplies}
          onSelect={(reply, position) => onSelectSuggestedReply(reply, position, message.id)}
        />
      )}

      {message.role === "assistant" && !!message.error && !!onSelectErrorAction && (
        <>
          <Spacer y={2} />
          <ArtAssistantErrorActions error={message.error} onSelect={onSelectErrorAction} />
        </>
      )}
    </Flex>
  )
}

const ArtAssistantActivityStatus: React.FC<{ text: string }> = ({ text }) => (
  <Flex alignItems="flex-start">
    <Flex
      accessibilityLiveRegion="polite"
      alignSelf="flex-start"
      backgroundColor="mono5"
      borderRadius={15}
      maxWidth="75%"
      px={1}
      py={0.5}
      testID="art-assistant-activity-status"
    >
      <Text color="mono60" variant="xs">
        {text}
      </Text>
    </Flex>
  </Flex>
)
