import { graphql } from "react-relay"

export const artAssistantAgentTurnSubscription = graphql`
  subscription ArtAssistantAgentTurnSubscription($input: AIAgentTurnInput!) {
    aiAgentTurn(input: $input) {
      __typename

      ... on AIAgentTextDelta {
        text
      }

      ... on AIAgentToolCall {
        activity
      }

      ... on AIAgentToolResult {
        ok
      }

      ... on AIAgentTurnComplete {
        message
        stopReason
        toolCallCount
        artworks {
          internalID
        }
      }
    }
  }
`
