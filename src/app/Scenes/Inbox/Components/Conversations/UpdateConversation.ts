import { UpdateConversationMutation } from "__generated__/UpdateConversationMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"
import { MutationConfig } from "relay-runtime"

interface Conversation {
  id: string
  internalID: string
}

export function updateConversation(
  conversation: Conversation,
  fromLastViewedMessageId: string,
  onCompleted: MutationConfig<any>["onCompleted"],
  onError: MutationConfig<any>["onError"]
) {
  return commitMutation<UpdateConversationMutation>(defaultEnvironment, {
    updater: (store) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      store.get(conversation.id).setValue(false, "unread")
    },
    onCompleted,
    onError,
    mutation: graphql`
      mutation UpdateConversationMutation($input: UpdateConversationMutationInput!) {
        updateConversation(input: $input) {
          conversation {
            internalID
            from_last_viewed_message_id: fromLastViewedMessageID
          }
        }
      }
    `,
    variables: {
      input: {
        conversationId: conversation.internalID,
        fromLastViewedMessageId,
      },
    },
  })
}
