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

const ComposerContainer = styled.View`
  paddingTop: 5
  marginRight: 20
  marginLeft: 20
`

const PAGE_SIZE = 10

export class Conversation extends React.Component<RelayProps, any> {
  renderMessage({ item }) {
    // End of the list reached. Increase page size. Relay
    // will fetch only the required data to fill the new
    // page size.
    if (item.key === this.props.me.conversation.messages.edges.length - 1) {
      this.props.relay.setVariables({ pageSize: this.props.me.conversation.messages.edges.length + PAGE_SIZE })
    }
    const artwork = this.props.me.conversation.artworks[0]
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name
    return (
      <Message
        message={item}
        partnerName={partnerName}
        userName={conversation.from.name}
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
        <ComposerContainer>
          <Composer
            onSubmit={text => {
              this.props.relay.commitUpdate(
                new SendConversationMessageMutation({
                  body_text: text,
                  reply_to_message_id: lastMessage.impulse_id,
                  conversation: this.props.me.conversation as any,
                })
              )

              /// Not sure how to get optimistic re-render?
              this.props.relay.setVariables({ pageSize: this.props.me.conversation.messages.edges.length + 1 })
            }}
          />
        </ComposerContainer>
      </Container>
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
          }
          to {
            name
          }
          messages(first: $pageSize) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                impulse_id
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
  relay: any
  me: {
    conversation: {
      from: {
        name: string
      }
      to: {
        name: string
      }
      artworks: any[]
      messages: {
        pageInfo?: {
          hasNextPage: boolean
        }
        edges: Array<{
          node: { impulse_id: string } | null
        }>
      }
    }
  }
}
