import { OwnerType } from "@artsy/cohesion"
import { InfoIcon } from "@artsy/icons/native"
import { BackButton, Screen, Touchable } from "@artsy/palette-mobile"
import NetInfo from "@react-native-community/netinfo"
import { ConversationQuery } from "__generated__/ConversationQuery.graphql"
import { Conversation_me$data } from "__generated__/Conversation_me.graphql"
import ConnectivityBanner from "app/Components/ConnectivityBanner"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { ComposerFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/Composer"
import Messages from "app/Scenes/Inbox/Components/Conversations/Messages"
import { sendConversationMessage } from "app/Scenes/Inbox/Components/Conversations/SendConversationMessage"
import { updateConversation } from "app/Scenes/Inbox/Components/Conversations/UpdateConversation"
import { ShadowSeparator } from "app/Scenes/Inbox/Components/ShadowSeparator"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate, navigationEvents } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useRef, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`

interface Props {
  me: Conversation_me$data
  relay: RelayRefetchProp
  onMessageSent?: (text: string) => void
  navigator: NavigatorIOS
}

export const Conversation: React.FC<Props> = ({
  me,
  relay,
  onMessageSent,
  navigator: _navigator,
}) => {
  const [sendingMessage, setSendingMessage] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [markedMessageAsRead, setMarkedMessageAsRead] = useState(false)
  const [failedMessageText, setFailedMessageText] = useState<string | null>(null)

  const messagesRef = useRef<any>(null)
  const tracking = useTracking()

  const handleConnectivityChange = (state: any) => {
    setIsConnected(state.isConnected)
  }

  const refetch = React.useCallback(() => {
    relay.refetch(
      { conversationID: me.conversation?.internalID },
      null,
      (error) => {
        if (error) {
          console.error("Conversation.tsx", error.message)
        }
      },
      { force: true }
    )
  }, [relay, me.conversation?.internalID])

  const handleModalDismissed = React.useCallback(() => {
    refetch()
  }, [refetch])

  const maybeMarkLastMessageAsRead = React.useCallback(() => {
    const conversation = me.conversation
    if (conversation?.unread && !markedMessageAsRead && conversation.lastMessageID) {
      updateConversation(
        conversation as any,
        conversation.lastMessageID,
        (_response) => {
          setMarkedMessageAsRead(true)
          GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
        },
        (error) => {
          console.warn(error)
          setMarkedMessageAsRead(true)
          GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
        }
      )
    }
  }, [me.conversation, markedMessageAsRead])

  const messageSuccessfullySent = (text: string) => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Success,
      action_name: Schema.ActionNames.ConversationSendReply,
      owner_id: me.conversation?.internalID,
      owner_type: Schema.OwnerEntityTypes.Conversation,
    })

    setSendingMessage(false)

    if (onMessageSent) {
      onMessageSent(text)
    }
  }

  const messageFailedToSend = (error: Error, text: string) => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Fail,
      action_name: Schema.ActionNames.ConversationSendReply,
      owner_id: me.conversation?.internalID,
      owner_type: Schema.OwnerEntityTypes.Conversation,
    })

    console.warn(error)
    setSendingMessage(false)
    setFailedMessageText(text)
  }

  useEffect(() => {
    NetInfo.addEventListener(handleConnectivityChange)
    maybeMarkLastMessageAsRead()
    navigationEvents.addListener("modalDismissed", handleModalDismissed)
    navigationEvents.addListener("goBack", handleModalDismissed)

    return () => {
      navigationEvents.removeListener("modalDismissed", handleModalDismissed)
      navigationEvents.removeListener("goBack", handleModalDismissed)
    }
  }, [handleModalDismissed, maybeMarkLastMessageAsRead])

  const conversation = me.conversation

  if (!conversation) {
    return <LoadFailureView trackErrorBoundary={false} />
  }

  const partnerName = conversation.to.name

  return (
    <PageWithSimpleHeader
      title={partnerName}
      left={<BackButton onPress={goBack} />}
      noSeparator
      right={
        <Touchable
          accessibilityRole="button"
          onPress={() => {
            navigate(`/conversation/${conversation?.internalID}/details`)
          }}
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <InfoIcon />
        </Touchable>
      }
    >
      <ComposerFragmentContainer
        conversation={conversation}
        disabled={sendingMessage || !isConnected}
        // @ts-expect-error REACT_18_UPGRADE
        value={failedMessageText}
        onSubmit={(text: string) => {
          setSendingMessage(true)
          setFailedMessageText(null)
          sendConversationMessage(
            relay.environment,
            conversation as any,
            text,
            (_response) => {
              messageSuccessfullySent(text)
            },
            (error) => {
              messageFailedToSend(error, text)
            }
          )
          messagesRef.current?.scrollToLastMessage()
        }}
      >
        <Container>
          <ShadowSeparator />
          {!isConnected && <ConnectivityBanner />}
          <Messages
            componentRef={(messages) => (messagesRef.current = messages)}
            conversation={conversation as any}
            onRefresh={() => {
              relay.refetch(
                { conversationID: conversation?.internalID },
                null,
                (error) => {
                  if (error) {
                    console.error("Conversation.tsx", error.message)
                  }
                },
                { force: true }
              )
            }}
          />
        </Container>
      </ComposerFragmentContainer>
    </PageWithSimpleHeader>
  )
}

export const ConversationFragmentContainer = createRefetchContainer(
  Conversation,
  {
    me: graphql`
      fragment Conversation_me on Me {
        conversation(id: $conversationID) {
          ...Composer_conversation
          ...Messages_conversation
          internalID
          id
          lastMessageID
          unread
          to {
            name
          }
          from {
            email
          }
        }
      }
    `,
  },
  graphql`
    query ConversationRefetchQuery($conversationID: String!) {
      me {
        ...Conversation_me
      }
    }
  `
)

export const ConversationScreenQuery = graphql`
  query ConversationQuery($conversationID: String!) {
    me {
      ...Conversation_me
    }
  }
`

export const ConversationQueryRenderer: React.FC<{
  conversationID: string
  navigator: NavigatorIOS
}> = (props) => {
  const { conversationID, navigator } = props
  return (
    <Screen>
      <ProvideScreenTracking
        info={{
          context_screen: Schema.PageNames.ConversationPage,
          context_screen_owner_id: props.conversationID,
          context_screen_owner_type: OwnerType.conversation,
        }}
      >
        <QueryRenderer<ConversationQuery>
          environment={getRelayEnvironment()}
          query={ConversationScreenQuery}
          variables={{
            conversationID,
          }}
          cacheConfig={{ force: true }}
          render={renderWithLoadProgress(ConversationFragmentContainer, { navigator })}
        />
      </ProvideScreenTracking>
    </Screen>
  )
}
