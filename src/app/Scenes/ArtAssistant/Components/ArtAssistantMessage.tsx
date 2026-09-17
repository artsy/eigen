import { Flex, Text } from "@artsy/palette-mobile"
import { ArtAssistantArtworkRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkRail"
import { ArtAssistantMessage as ArtAssistantMessageType } from "app/Scenes/ArtAssistant/types"

interface ArtAssistantMessageProps {
  message: ArtAssistantMessageType
}

export const ArtAssistantMessage: React.FC<ArtAssistantMessageProps> = ({ message }) => {
  const isUser = message.role === "user"
  const respondingText = message.role === "assistant" ? message.progress.at(-1) : undefined
  const text =
    message.role === "assistant" && message.phase === "error"
      ? message.errorMessage ?? "Something went wrong. Please try again."
      : message.text || respondingText || "Thinking..."

  return (
    <Flex alignItems={isUser ? "flex-end" : "flex-start"}>
      <Flex
        accessibilityLiveRegion={
          message.role === "assistant" && message.phase === "responding" ? "polite" : undefined
        }
        alignSelf={isUser ? "flex-end" : "flex-start"}
        backgroundColor={isUser ? "mono100" : "mono10"}
        borderRadius={15}
        maxWidth="66.67%"
        px={1}
        py={1}
        testID={`art-assistant-${message.role}-message`}
      >
        <Text color={isUser ? "mono0" : "mono100"} variant="sm">
          {text}
        </Text>
      </Flex>

      {message.role === "assistant" && !!message.artworkRail && (
        <Flex alignSelf="stretch" mt={1} mx={-2}>
          <ArtAssistantArtworkRail state={message.artworkRail} />
        </Flex>
      )}
    </Flex>
  )
}
