import { commitMutation, graphql } from "react-relay"
import { Environment, MutationConfig } from "relay-runtime"

interface Conversation {
  __id: string
  id: string
}

export function markLastMessageRead(
  environment: Environment,
  conversation: Conversation,
  deliveryId: string,
  onCompleted: MutationConfig<any>["onCompleted"],
  onError: MutationConfig<any>["onError"]
) {
  return commitMutation(environment, {
    updater: store => {
      const currentTime = new Date().toISOString()
      store.get(conversation.__id).setValue(currentTime, "last_message_open")
    },
    onCompleted,
    onError,
    mutation: graphql`
      mutation MarkReadMessageMutation($input: MarkReadMessageMutationInput!) {
        markReadMessage(input: $input) {
          delivery {
            id
            opened_at
          }
        }
      }
    `,
    variables: {
      input: {
        conversationId: conversation.id,
        deliveryId,
      },
    },
  })
}
