import { commitMutation, Environment, graphql, MutationConfig, RecordSourceSelectorProxy } from "react-relay"
import { RelayProps } from "../../../Containers/Conversation"

export function markLastMessageRead(
  environment: Environment,
  conversation: RelayProps["me"]["conversation"],
  deliveryId: string,
  onCompleted: MutationConfig["onCompleted"],
  onError: MutationConfig["onError"]
) {
  const storeUpdater = (store: RecordSourceSelectorProxy) => {
    const currentTime = new Date().toISOString()
    store.get(conversation.__id).setValue(currentTime, "last_message_open")
  }

  return commitMutation(environment, {
    updater: storeUpdater,
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
