import React from "react"
import { createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"

import { Schema, Track, track as _track } from "../utils/track"

import { SmallHeadline } from "../Components/Inbox/Typography"

import { NetInfo, View } from "react-native"

import colors from "lib/data/colors"
import styled from "styled-components/native"

import ConnectivityBanner from "../Components/ConnectivityBanner"

import Composer from "../Components/Inbox/Conversations/Composer"
import Messages from "../Components/Inbox/Conversations/Messages"
import { sendConversationMessage } from "../Components/Inbox/Conversations/SendConversationMessage"
import Separator from "../Components/Separator"

import { markLastMessageRead } from "../Components/Inbox/Conversations/MarkReadMessage"

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 20px;
  flex-direction: column;
  margin-bottom: 20px;
`

// This makes it really easy to style the HeaderTextContainer with space-between
const PlaceholderView = View

const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`

interface Props extends RelayProps {
  relay?: RelayPaginationProp
  onMessageSent?: (text: string) => void
}

interface State {
  sendingMessage: boolean
  isConnected: boolean
  markedMessageAsRead: boolean
  fetchingData: boolean
  failedMessageText?: string
  shouldShowSeparator?: boolean
}

const track: Track<Props, State> = _track

@track()
export class Conversation extends React.Component<Props, State> {
  composer: Composer

  constructor(props) {
    super(props)

    // Assume if the component loads, connection exists (this way the banner won't flash unnecessarily)
    this.state = {
      sendingMessage: false,
      isConnected: true,
      markedMessageAsRead: false,
      fetchingData: false,
      shouldShowSeparator: false,
    }
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this)
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectivityChange)
    this.maybeMarkLastMessageAsRead()
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener("connectionChange", this.handleConnectivityChange)
  }

  handleConnectivityChange(isConnected) {
    this.setState({ isConnected })
  }

  maybeMarkLastMessageAsRead() {
    const conversation = this.props.me.conversation
    if (conversation.is_last_message_to_user && !conversation.last_message_open && !this.state.markedMessageAsRead) {
      markLastMessageRead(
        this.props.relay.environment,
        conversation,
        conversation.last_message_delivery_id,
        _response => {
          this.setState({ markedMessageAsRead: true })
        },
        error => {
          console.warn(error)
          this.setState({ markedMessageAsRead: true })
        }
      )
    }
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConversationSendReply,
    owner_id: props.me.conversation.id,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageSuccessfullySent(text: string) {
    this.setState({ sendingMessage: false })

    if (this.props.onMessageSent) {
      this.props.onMessageSent(text)
    }
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.ConversationSendReply,
    owner_id: props.me.conversation.id,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageFailedToSend(error: Error, text: string) {
    console.warn(error)
    this.setState({ sendingMessage: false, failedMessageText: text })
  }

  render() {
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name

    return (
      <Composer
        disabled={this.state.sendingMessage || !this.state.isConnected}
        ref={composer => (this.composer = composer)}
        value={this.state.failedMessageText}
        onSubmit={text => {
          this.setState({ sendingMessage: true, failedMessageText: null })
          sendConversationMessage(
            this.props.relay.environment,
            conversation,
            text,
            _response => {
              this.messageSuccessfullySent(text)
            },
            error => {
              this.messageFailedToSend(error, text)
            }
          )
        }}
      >
        <Container>
          <Header>
            <HeaderTextContainer>
              <SmallHeadline style={{ fontSize: 14 }}>{partnerName}</SmallHeadline>
              <PlaceholderView />
            </HeaderTextContainer>
          </Header>
          <Separator style={{ backgroundColor: this.state.shouldShowSeparator ? colors["gray-regular"] : "white" }} />
          {!this.state.isConnected && <ConnectivityBanner />}
          <Messages
            conversation={conversation as any}
            onDataFetching={loading => {
              this.setState({ fetchingData: loading })
            }}
            shouldShowSeparator={shouldShowSeparator => {
              this.setState({ shouldShowSeparator })
            }}
          />
        </Container>
      </Composer>
    )
  }
}

export default createFragmentContainer(Conversation, {
  me: graphql`
    fragment Conversation_me on Me {
      conversation(id: $conversationID) {
        id
        __id
        to {
          name
          initials
        }
        from {
          email
        }
        last_message_id
        ...Messages_conversation
        initial_message
        is_last_message_to_user
        last_message_open
        last_message_delivery_id
      }
    }
  `,
})

interface RelayProps {
  me: {
    conversation: {
      id: string
      __id: string
      to: {
        name: string
        initials: string
      }
      from: {
        email: string
      }
      last_message_id: string
      initial_message: string
      is_last_message_to_user: boolean
      last_message_open: string | null
      last_message_delivery_id: string | null
    }
  }
}
