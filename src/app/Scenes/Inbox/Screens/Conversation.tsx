import { OwnerType } from "@artsy/cohesion"
import { BackButton, InfoCircleIcon, Screen, Touchable } from "@artsy/palette-mobile"
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
import { goBack, navigate, navigationEvents } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { track as _track, ProvideScreenTracking, Schema, Track } from "app/utils/track"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
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

interface State {
  sendingMessage: boolean
  isConnected: boolean
  markedMessageAsRead: boolean
  fetchingData: boolean
  failedMessageText: string | null
}

const track: Track<Props, State> = _track

@track()
export class Conversation extends React.Component<Props, State> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  messages: MessagesComponent
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  composer: Composer

  // Assume if the component loads, connection exists (this way the banner won't flash unnecessarily)
  state = {
    sendingMessage: false,
    isConnected: true,
    markedMessageAsRead: false,
    fetchingData: false,
    failedMessageText: null,
  }

  componentDidMount() {
    NetInfo.addEventListener(this.handleConnectivityChange)
    this.maybeMarkLastMessageAsRead()
    navigationEvents.addListener("modalDismissed", this.handleModalDismissed)
    navigationEvents.addListener("goBack", this.handleModalDismissed)
  }

  componentWillUnmount() {
    navigationEvents.removeListener("modalDismissed", this.handleModalDismissed)
    navigationEvents.removeListener("goBack", this.handleModalDismissed)
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected })
  }

  handleModalDismissed = () => {
    this.refetch()
  }

  refetch = () => {
    this.props.relay.refetch(
      { conversationID: this.props.me.conversation?.internalID },
      null,
      (error) => {
        if (error) {
          console.error("Conversation.tsx", error.message)
        }
      },
      { force: true }
    )
  }

  maybeMarkLastMessageAsRead() {
    const conversation = this.props.me.conversation
    if (conversation?.unread && !this.state.markedMessageAsRead) {
      updateConversation(
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        conversation,
        conversation.lastMessageID,
        (_response) => {
          this.setState({ markedMessageAsRead: true })
          GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
        },
        (error) => {
          console.warn(error)
          this.setState({ markedMessageAsRead: true })
          GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
        }
      )
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConversationSendReply,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    owner_id: props.me.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageSuccessfullySent(text: string) {
    this.setState({ sendingMessage: false })

    if (this.props.onMessageSent) {
      this.props.onMessageSent(text)
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props) => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.ConversationSendReply,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    owner_id: props.me.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageFailedToSend(error: Error, text: string) {
    console.warn(error)
    this.setState({ sendingMessage: false, failedMessageText: text })
  }

  render() {
    const conversation = this.props.me.conversation

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
              navigate(`/conversation/${this.props.me?.conversation?.internalID}/details`)
            }}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <InfoCircleIcon />
          </Touchable>
        }
      >
        <ComposerFragmentContainer
          conversation={conversation}
          disabled={this.state.sendingMessage || !this.state.isConnected}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          ref={(composer) => (this.composer = composer)}
          value={this.state.failedMessageText}
          onSubmit={(text: string) => {
            this.setState({ sendingMessage: true, failedMessageText: null })
            sendConversationMessage(
              this.props.relay.environment,
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              conversation,
              text,
              (_response) => {
                this.messageSuccessfullySent(text)
              },
              (error) => {
                this.messageFailedToSend(error, text)
              }
            )
            this.messages.scrollToLastMessage()
          }}
        >
          <Container>
            <ShadowSeparator />
            {!this.state.isConnected && <ConnectivityBanner />}
            <Messages
              componentRef={(messages) => (this.messages = messages)}
              conversation={conversation as any}
              onDataFetching={(loading: boolean) => {
                this.setState({ fetchingData: loading })
              }}
              onRefresh={() => {
                this.props.relay.refetch(
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
