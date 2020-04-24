import NetInfo from "@react-native-community/netinfo"
import { Conversation_me } from "__generated__/Conversation_me.graphql"
import { ConversationQuery } from "__generated__/ConversationQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"
import ConnectivityBanner from "../Components/ConnectivityBanner"
import Composer from "../Components/Inbox/Conversations/Composer"
import Messages from "../Components/Inbox/Conversations/Messages"
import { Messages as MessagesComponent } from "../Components/Inbox/Conversations/Messages"
import { sendConversationMessage } from "../Components/Inbox/Conversations/SendConversationMessage"
import { updateConversation } from "../Components/Inbox/Conversations/UpdateConversation"
import { SmallHeadline } from "../Components/Inbox/Typography"
import { Schema, Track, track as _track } from "../utils/track"

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 22px;
  flex-direction: column;
  margin-bottom: 18px;
`

// This makes it really easy to style the HeaderTextContainer with space-between
const PlaceholderView = View

const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`

interface Props {
  me: Conversation_me
  relay: RelayProp
  onMessageSent?: (text: string) => void
}

interface State {
  sendingMessage: boolean
  isConnected: boolean
  markedMessageAsRead: boolean
  fetchingData: boolean
  failedMessageText: string | null
}

// @ts-ignore STRICTNESS_MIGRATION
const track: Track<Props, State> = _track

@track()
export class Conversation extends React.Component<Props, State> {
  // @ts-ignore STRICTNESS_MIGRATION
  messages: MessagesComponent
  // @ts-ignore STRICTNESS_MIGRATION
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
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectivityChange)
    this.maybeMarkLastMessageAsRead()
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener("connectionChange", this.handleConnectivityChange)
  }

  // @ts-ignore STRICTNESS_MIGRATION
  handleConnectivityChange = isConnected => {
    this.setState({ isConnected })
  }

  maybeMarkLastMessageAsRead() {
    const conversation = this.props.me.conversation
    // @ts-ignore STRICTNESS_MIGRATION
    if (conversation.unread && !this.state.markedMessageAsRead) {
      updateConversation(
        this.props.relay.environment,
        // @ts-ignore STRICTNESS_MIGRATION
        conversation,
        // @ts-ignore STRICTNESS_MIGRATION
        conversation.lastMessageID,
        // @ts-ignore STRICTNESS_MIGRATION
        _response => {
          this.setState({ markedMessageAsRead: true })
        },
        // @ts-ignore STRICTNESS_MIGRATION
        error => {
          console.warn(error)
          this.setState({ markedMessageAsRead: true })
        }
      )
    }
  }

  // @ts-ignore STRICTNESS_MIGRATION
  @track(props => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConversationSendReply,
    // @ts-ignore STRICTNESS_MIGRATION
    owner_id: props.me.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageSuccessfullySent(text: string) {
    this.setState({ sendingMessage: false })

    if (this.props.onMessageSent) {
      this.props.onMessageSent(text)
    }
  }

  // @ts-ignore STRICTNESS_MIGRATION
  @track(props => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.ConversationSendReply,
    // @ts-ignore STRICTNESS_MIGRATION
    owner_id: props.me.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageFailedToSend(error: Error, text: string) {
    console.warn(error)
    this.setState({ sendingMessage: false, failedMessageText: text })
  }

  render() {
    const conversation = this.props.me.conversation
    // @ts-ignore STRICTNESS_MIGRATION
    const partnerName = conversation.to.name

    return (
      <Composer
        disabled={this.state.sendingMessage || !this.state.isConnected}
        // @ts-ignore STRICTNESS_MIGRATION
        ref={composer => (this.composer = composer)}
        // @ts-ignore STRICTNESS_MIGRATION
        value={this.state.failedMessageText}
        onSubmit={text => {
          this.setState({ sendingMessage: true, failedMessageText: null })
          sendConversationMessage(
            this.props.relay.environment,
            // @ts-ignore STRICTNESS_MIGRATION
            conversation,
            text,
            // @ts-ignore STRICTNESS_MIGRATION
            _response => {
              this.messageSuccessfullySent(text)
            },
            // @ts-ignore STRICTNESS_MIGRATION
            error => {
              this.messageFailedToSend(error, text)
            }
          )
          this.messages.scrollToLastMessage()
        }}
      >
        <Container>
          <Header>
            <HeaderTextContainer>
              <SmallHeadline style={{ fontSize: 14 }}>{partnerName}</SmallHeadline>
              <PlaceholderView />
            </HeaderTextContainer>
          </Header>
          {!this.state.isConnected && <ConnectivityBanner />}
          <Messages
            componentRef={messages => (this.messages = messages)}
            conversation={conversation as any}
            onDataFetching={loading => {
              this.setState({ fetchingData: loading })
            }}
          />
        </Container>
      </Composer>
    )
  }
}

export const ConversationFragmentContainer = createFragmentContainer(Conversation, {
  me: graphql`
    fragment Conversation_me on Me {
      conversation(id: $conversationID) {
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
        ...Messages_conversation
      }
    }
  `,
})

export const ConversationRenderer: React.SFC<{
  conversationID: string
}> = ({ conversationID }) => {
  return (
    <QueryRenderer<ConversationQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ConversationQuery($conversationID: String!) {
          me {
            ...Conversation_me
          }
        }
      `}
      variables={{
        conversationID,
      }}
      render={renderWithLoadProgress(ConversationFragmentContainer)}
    />
  )
}
