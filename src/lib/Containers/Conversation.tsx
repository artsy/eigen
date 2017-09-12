import { MarkdownString } from "danger/distribution/dsl/Aliases"
import * as React from "react"
import { createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"
import { ConnectionHandler } from "relay-runtime"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { FlatList, ImageURISource, NetInfo, View, ViewProperties } from "react-native"
import ReversedFlatList from "react-native-reversed-flat-list"

import styled from "styled-components/native"
import colors from "../../data/colors"
import fonts from "../../data/fonts"
import ConnectivityBanner from "../Components/ConnectivityBanner"

import Composer from "../Components/Inbox/Conversations/Composer"
import Messages from "../Components/Inbox/Conversations/Messages"
import { sendConversationMessage } from "../Components/Inbox/Conversations/SendConversationMessage"

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

const PAGE_SIZE = 100

interface Props extends RelayProps {
  relay?: RelayPaginationProp
}

interface State {
  sendingMessage: boolean
  isConnected: boolean
}

export class Conversation extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    // Assume if the component loads, connection exists (this way the banner won't flash unnecessarily)
    this.state = {
      sendingMessage: false,
      isConnected: true,
    }
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this)
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectivityChange)
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener("connectionChange", this.handleConnectivityChange)
  }

  handleConnectivityChange(isConnected) {
    this.setState({ isConnected })
  }

  render() {
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name

    return (
      <Composer
        disabled={this.state.sendingMessage}
        onSubmit={text => {
          this.setState({ sendingMessage: true })
          sendConversationMessage(
            this.props.relay.environment,
            conversation,
            text,
            response => {
              this.setState({ sendingMessage: false })
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
          </Header>
          {!this.state.isConnected && <ConnectivityBanner />}
          <Messages conversation={conversation} />
        </Container>
      </Composer>
    )
  }
}

export default createFragmentContainer(Conversation, {
  me: graphql`
    fragment Conversation_me on Me {
      conversation(id: $conversationID) {
        to {
          name
          initials
        }
        ...Messages_conversation
      }
    }
  `,
})

interface RelayProps {
  me: {
    conversation: {
      __id: string
      id: string
      from: {
        name: string
        email: string
        initials: string
      }
      to: {
        name: string
        initials: string
      }
      messages: {
        pageInfo?: {
          hasNextPage: boolean
        }
        edges: Array<{
          node: {
            impulse_id: string
            is_from_user: boolean
          } | null
        }>
      }
      items: Array<{
        item: any
      }>
    }
  }
}
