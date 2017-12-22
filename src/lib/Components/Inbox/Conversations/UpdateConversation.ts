import { commitMutation, graphql } from "react-relay"
import { Environment, MutationConfig } from "relay-runtime"

interface Conversation {
  __id: string
  id: string
}

export function updateConversation(
  environment: Environment,
  conversation: Conversation,
  fromLastViewedMessageId: string,
  onCompleted: MutationConfig<any>["onCompleted"],
  onError: MutationConfig<any>["onError"]
) {
  return commitMutation(environment, {
    updater: store => {
      store.get(conversation.__id).setValue(false, "unread")
    },
    onCompleted,
    onError,
    mutation: graphql`
      mutation UpdateConversationMutation($input: UpdateConversationMutationInput!) {
        updateConversation(input: $input) {
          conversation {
            id
            from_last_viewed_message_id
          }
        }
      }
    `,
    variables: {
      input: {
        conversationId: conversation.id,
        fromLastViewedMessageId,
      },
    },
  })
}
