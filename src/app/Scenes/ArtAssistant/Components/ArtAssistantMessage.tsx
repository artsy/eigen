import { Flex, Text } from "@artsy/palette-mobile"
import { ArtAssistantArtworkRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkRail"
import { ArtAssistantMessage as ArtAssistantMessageType } from "app/Scenes/ArtAssistant/types"

interface ArtAssistantMessageProps {
  message: ArtAssistantMessageType
}

export const ArtAssistantMessage: React.FC<ArtAssistantMessageProps> = ({ message }) => {
  const isUser = message.role === "user"

  if (message.role === "assistant" && message.phase === "responding") {
    return <ArtAssistantActivityStatus text={message.activity ?? "Thinking..."} />
  }

  return (
    <Flex alignItems={isUser ? "flex-end" : "flex-start"}>
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

      {message.role === "assistant" && !!message.artworkRail && (
        <Flex alignSelf="stretch" mt={1} mx={-2}>
          <ArtAssistantArtworkRail state={message.artworkRail} />
        </Flex>
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
