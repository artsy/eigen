import { MarkdownString } from "danger/distribution/dsl/Aliases"
import * as React from "react"
import { createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"
import { ConnectionHandler } from "relay-runtime"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { ActivityIndicator, FlatList, ImageURISource, NetInfo, View, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../data/colors"
import fonts from "../../data/fonts"
import ConnectivityBanner from "../Components/ConnectivityBanner"

import Composer from "../Components/Inbox/Conversations/Composer"
import Messages from "../Components/Inbox/Conversations/Messages"
import { sendConversationMessage } from "../Components/Inbox/Conversations/SendConversationMessage"

import { markLastMessageRead } from "../Components/Inbox/Conversations/MarkReadMessage"

import ARSwitchBoard from "../NativeModules/SwitchBoard"

// tslint:disable-next-line:no-var-requires
const chevron: ImageURISource = require("../../../images/horizontal_chevron.png")

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 10px;
  flex-direction: column;
  margin-bottom: 20px;
`

// This makes it really easy to style the HeaderTextContainer with space-between
const PlaceholderView = View

const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const BackButtonPlaceholder = styled.Image`
  height: 12;
  width: 7;
  transform: rotate(180deg);
`

const DottedBorder = styled.View`
  height: 1;
  border-width: 1;
  border-style: dotted;
  border-color: ${colors["gray-regular"]};
  margin-left: 20;
  margin-right: 20;
`

const MessagesList = styled(FlatList)`
  margin-top: 10;
`

const LoadingIndicator = styled(ActivityIndicator)`
  margin-top: 20;
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
}

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
        response => {
          this.setState({ markedMessageAsRead: true })
        },
        error => {
          console.warn(error)
          this.setState({ markedMessageAsRead: true })
        }
      )
    }
  }

  render() {
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name

    return (
      <Composer
        disabled={this.state.sendingMessage}
        ref={composer => (this.composer = composer)}
        onSubmit={text => {
          this.setState({ sendingMessage: true })

          sendConversationMessage(
            this.props.relay.environment,
            conversation,
            text,
            response => {
              this.setState({ sendingMessage: false })

              if (this.props.onMessageSent) {
                this.props.onMessageSent(text)
              }
            },
            error => {
              console.warn(error)
              this.setState({ sendingMessage: false })
            }
          )
        }}
      >
        <Container>
          <Header>
            <HeaderTextContainer>
              <BackButtonPlaceholder source={chevron} />
              <SmallHeadline>
                {partnerName}
              </SmallHeadline>
              <PlaceholderView />
            </HeaderTextContainer>
            <LoadingIndicator animating={this.state.fetchingData} hidesWhenStopped />
          </Header>
          {!this.state.isConnected && <ConnectivityBanner />}
          <Messages
            conversation={conversation}
            onDataFetching={loading => {
              this.setState({ fetchingData: loading })
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
