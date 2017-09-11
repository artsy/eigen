import * as React from "react"
import {
  commitMutation,
  createRefetchContainer,
  Environment,
  graphql,
  MutationConfig,
  RecordSourceSelectorProxy,
  RelayRefetchProp,
} from "react-relay"
import { ConnectionHandler } from "relay-runtime"

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

const MessagesList = styled(FlatList)`
  margin-top: 10;
`

const PAGE_SIZE = 100

interface Props extends RelayProps {
  relay?: RelayRefetchProp
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
    const conversationItem = this.props.me.conversation.items[0].item
    const conversation = this.props.me.conversation
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
    const messages = conversation.messages.edges.map((edge, index) => {
      return { first_message: index === 0, key: index, ...edge.node }
    })
    const lastMessage = messages[messages.length - 1]

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

function sendConversationMessage(
  environment: Environment,
  conversation: RelayProps["me"]["conversation"],
  text: string,
  onCompleted: MutationConfig["onCompleted"],
  onError: MutationConfig["onError"]
) {
  const lastMessage = conversation.messages.edges[conversation.messages.edges.length - 1].node

  const storeUpdater = (store: RecordSourceSelectorProxy) => {
    const mutationPayload = store.getRootField("sendConversationMessage")
    const newMessageEdge = mutationPayload.getLinkedRecord("messageEdge")
    const connection = ConnectionHandler.getConnection(store.get(conversation.__id), "Conversation_messages")
    ConnectionHandler.insertEdgeAfter(connection, newMessageEdge)
  }

  return commitMutation(environment, {
    onCompleted,
    onError,

    optimisticUpdater: storeUpdater,
    updater: storeUpdater,

    // TODO: See if we can extract the field selections into a fragment and share it with the normal pagination fragment.
    //      Also looks like we can get rid of the `body` selection.
    mutation: graphql`
      mutation ConversationSendMessageMutation($input: SendConversationMessageMutationInput!) {
        sendConversationMessage(input: $input) {
          messageEdge {
            node {
              impulse_id
              is_from_user
              body
              __id
              ...Message_message
            }
          }
        }
      }
    `,

    variables: {
      input: {
        id: conversation.id,
        from: conversation.from.email,
        body_text: text,
        // Reply to the last message
        reply_to_message_id: lastMessage.impulse_id,
      },
    },

    // TODO: Figure out which of these keys is *actually* required for Relay Modern and update the typings to reflect that.
    //      And if it’s really true that this config isn’t enough to update the connection and we really need the updater
    //      functions.
    configs: [
      {
        type: "RANGE_ADD",
        parentName: "conversation",
        parentID: "__id",
        connectionName: "messages",
        edgeName: "messageEdge",
        rangeBehaviors: {
          "": "append",
        },
        connectionInfo: [
          {
            key: "Conversation_messages",
            rangeBehavior: "append",
          },
        ],
      },
    ],

    optimisticResponse: {
      sendConversationMessage: {
        messageEdge: {
          node: {
            body: text,
            from: {
              email: conversation.from.email,
              name: null,
            },
            is_from_user: true,
            created_at: null, // Intentionally left blank so Message can recognize this as an optimistic response.
            attachments: [],
          },
        },
      },
    },
  })
}

// TODO: Make this a pagination container instead of fetching 100 messages
export default createRefetchContainer(
  Conversation,
  graphql`
    fragment Conversation_me on Me {
      conversation(id: $conversationID) {
        __id
        id
        from {
          name
          email
          initials
        }
        to {
          name
          initials
        }
        messages(first: 200) @connection(key: "Conversation_messages") {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              impulse_id
              is_from_user
              body
              ...Message_message
            }
          }
        }
        items {
          item {
            ... on Artwork {
              __typename
              href
              ...ArtworkPreview_artwork
            }
            ... on Show {
              __typename
              href
              ...ShowPreview_show
            }
          }
        }
      }
    }
  `,
  graphql`
    query ConversationRefetchQuery($conversationID: String!) {
      me {
        ...Conversation_me
      }
    }
  `
)

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
