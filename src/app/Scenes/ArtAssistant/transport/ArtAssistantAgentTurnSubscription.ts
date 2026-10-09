import { graphql } from "react-relay"

/**
 * `sections` only selects `internalID`s: the rails re-query display data themselves, so anything
 * more would be paid for on every turn and thrown away. Legacy `artworks` is superseded by
 * `sections` and kept as a fallback until typed sections are proven in production.
 */
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

        sections {
          __typename

          ... on AIAgentArtworksSection {
            artworks {
              internalID
            }
          }

          ... on AIAgentArtistsSection {
            artists {
              internalID
            }
          }
        }

        artworks {
          internalID
        }
      }
    }
  }
`
