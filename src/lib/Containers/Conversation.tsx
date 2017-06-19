import * as React from "react"
import * as Relay from "react-relay/classic"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { FlatList, ImageURISource, NetInfo, View, ViewProperties } from "react-native"
import ReversedFlatList from "react-native-reversed-flat-list"

import styled from "styled-components/native"
import colors from "../../data/colors"
import fonts from "../../data/fonts"
import ConnectivityBanner from "../Components/ConnectivityBanner"

import Composer from "../Components/Inbox/Conversations/Composer"
import Message from "../Components/Inbox/Conversations/Message"
import ArtworkPreview from "../Components/Inbox/Conversations/Preview/ArtworkPreview"
import ShowPreview from "../Components/Inbox/Conversations/Preview/ShowPreview"

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

const MessagesList = styled(FlatList) `
  margin-top: 10;
`

const PAGE_SIZE = 100

interface Props extends RelayProps {
  relay?: Relay.RelayProp
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

  renderMessage({ item }) {
    const me = this.props.me
    const conversationItem = me.conversation.items[0].item
    const conversation = me.conversation
    const partnerName = conversation.to.name
    const senderName = item.is_from_user ? conversation.from.name : partnerName
    const initials = item.is_from_user ? conversation.from.initials : conversation.to.initials
    return (
      <Message
        message={item}
        senderName={senderName}
        initials={initials}
        artworkPreview={
          item.first_message &&
          conversationItem.__typename === "Artwork" &&
          <ArtworkPreview
            artwork={conversationItem}
            onSelected={() => ARSwitchBoard.presentNavigationViewController(this, conversationItem.href)}
          />
        }
        showPreview={
          item.first_message &&
          conversationItem.__typename === "Show" &&
          <ShowPreview
            show={conversationItem}
            onSelected={() => ARSwitchBoard.presentNavigationViewController(this, conversationItem.href)}
          />
        }
      />
    )
  }

  // FIXME This will perform a network request after initially rendering the component and thus always fetch the latest
  //       messages. However, with a cold Relay cache this leads to an initial double fetch, because Relay will also
  //       fetch the data before rendering the initial load.
  componentDidMount() {
    if (this.props.relay) {
      this.props.relay.forceFetch({})
    }

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
    const messages = conversation.messages.edges.map((edge, index) => {
      return { first_message: index === 0, key: index, ...edge.node }
    })
    const lastMessage = messages[messages.length - 1]

    return (
      <Composer
        disabled={this.state.sendingMessage}
        onSubmit={text => {
          this.props.relay.commitUpdate(
            new SendConversationMessageMutation({
              body_text: text,
              reply_to_message_id: lastMessage.impulse_id,
              conversation: this.props.me.conversation as any,
            }),
            {
              onFailure: transaction => {
                // TODO Actually handle errors
                console.warn(transaction.getError())
                this.setState({ sendingMessage: false })
              },
              onSuccess: () => {
                this.setState({ sendingMessage: false })
              },
            }
          )
          this.setState({ sendingMessage: true })
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
          <ReversedFlatList
            data={messages}
            renderItem={this.renderMessage.bind(this)}
            length={messages.length}
            ItemSeparatorComponent={DottedBorder}
          />
        </Container>
      </Composer>
    )
  }
}

interface MutationProps {
  body_text: string
  reply_to_message_id: string
  conversation: {
    __id: string
    id: string
    from: {
      email: string
    }
  }
}

class SendConversationMessageMutation extends Relay.Mutation<MutationProps, any> {
  static fragments = {
    conversation: () => Relay.QL`
      fragment on Conversation {
        __id
        id
        from {
          email
        }
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation { sendConversationMessage }`
  }

  getVariables() {
    return {
      id: this.props.conversation.id,
      from: this.props.conversation.from.email,
      body_text: this.props.body_text,
      reply_to_message_id: this.props.reply_to_message_id,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SendConversationMessageMutationPayload {
        messageEdge
        conversation {
          messages
        }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: "RANGE_ADD",
        parentName: "conversation",
        parentID: this.props.conversation.__id,
        connectionName: "messages",
        edgeName: "messageEdge",
        rangeBehaviors: {
          "": "append",
        },
      },
    ]
  }

  getOptimisticResponse() {
    return {
      messageEdge: {
        node: {
          body: this.props.body_text,
          is_from_user: true,
          created_at: new Date().toISOString(),
          attachments: [],
        },
      },
    }
  }
}

export default Relay.createContainer(Conversation, {
  initialVariables: {
    pageSize: PAGE_SIZE,
    conversationID: null,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        conversation(id: $conversationID) {
          from {
            name
            email
            initials
          }
          to {
            name
            initials
          }
          messages(first: $pageSize) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                impulse_id
                is_from_user
                ${Message.getFragment("message")}
              }
            }
          }
          items {
            item {
              ... on Artwork {
                __typename
                href
                ${ArtworkPreview.getFragment("artwork")}
              }
              ... on Show {
                __typename
                href
                ${ShowPreview.getFragment("show")}
              }
            }
          }
          ${SendConversationMessageMutation.getFragment("conversation")}
        }
      }
    `,
  },
})

interface RelayProps {
  me: {
    initials: string
    conversation: {
      from: {
        name: string
        email: string
        initials: string
      }
      to: {
        name: string
        initials: string
      }
      items: Array<{
        item: any
      }>
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
    }
  }
}
