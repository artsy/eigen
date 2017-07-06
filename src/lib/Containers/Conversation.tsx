import * as moment from "moment"
import * as React from "react"
import * as Relay from "react-relay"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { FlatList, ImageURISource, ViewProperties } from "react-native"
import ReversedFlatList from "react-native-reversed-flat-list"

import styled from "styled-components/native"
import colors from "../../data/colors"
import Composer from "../Components/Inbox/Conversations/Composer"
import Message from "../Components/Inbox/Conversations/Message"
import ArtworkPreview from "../Components/Inbox/Conversations/Preview/ArtworkPreview"

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
const PlaceholderView = styled.View``

const HeaderTextContainer = styled.View`
  flexDirection: row
  justifyContent: space-between
`

const BackButtonPlaceholder = styled.Image`
  height: 12
  width: 7
  transform: rotate(180deg)
`

const DottedBorder = styled.View`
  height: 1
  borderWidth: 1
  borderStyle: dotted
  borderColor: ${colors["gray-regular"]}
  marginLeft: 20
  marginRight: 20

`

const MessagesList = styled(FlatList)`
  marginTop: 10
`

const PAGE_SIZE = 100

interface Props extends RelayProps {
  relay?: Relay.RelayProp
}

interface State {
  sendingMessage: boolean
}

export class Conversation extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      sendingMessage: false,
    }
  }

  renderMessage({ item }) {
    const me = this.props.me
    const artwork = me.conversation.artworks[0]
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
          <ArtworkPreview
            artwork={artwork}
            onSelected={() => ARSwitchBoard.presentNavigationViewController(this, artwork.href)}
          />
        }
      />
    )
  }

  render() {
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name
    const artwork = conversation.artworks[0]
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
                console.error(transaction.getError())
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
          raw_text: this.props.body_text,
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
          artworks {
            href
            ${ArtworkPreview.getFragment("artwork")}
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
      artworks: {
        href: string
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
    }
  }
}
