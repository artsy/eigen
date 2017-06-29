import * as React from "react"
import * as Relay from "react-relay"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { FlatList, ImageURISource, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../data/colors"
import Composer from "../Components/Inbox/Conversations/Composer"
import Message from "../Components/Inbox/Conversations/Message"
import ArtworkPreview from "../Components/Inbox/Conversations/Previews/ArtworkPreview"

import ARSwitchBoard from "../NativeModules/SwitchBoard"

// tslint:disable-next-line:no-var-requires
const chevron: ImageURISource = require("../../../images/horizontal_chevron.png")

const Container = styled.View`
  flex: 1
  flexDirection: column
`
const Header = styled.View`
  alignSelf: stretch
  marginTop: 10
  flexDirection: column
  marginBottom: 20
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

export class Conversation extends React.Component<RelayProps, any> {
  renderMessage({ item }) {
    const artwork = this.props.me.conversation.artworks[0]
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name
    const senderName = item.is_from_user ? conversation.from.name : partnerName

    return (
      <Message
        message={item}
        senderName={senderName}
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
    const messages = this.props.me.conversation.messages.edges.map(({ node }, index) => {
      node.first_message = index === 0
      node.key = node.id
      return node
    })
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
        <MessagesList
          data={messages}
          renderItem={this.renderMessage.bind(this)}
          ItemSeparatorComponent={DottedBorder}
        />
        <ComposerContainer>
          <Composer />
        </ComposerContainer>
      </Container>
    )
  }
}

export default Relay.createContainer(Conversation, {
  initialVariables: {
    conversationID: null,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        conversation(id: $conversationID) {
          id
          from {
            name
            email
          }
          to {
            name
          }
          messages(first: 10) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                id
                ${Message.getFragment("message")}
              }
            }
          }
          artworks @relay (plural: true) {
            href
            ${ArtworkPreview.getFragment("artwork")}
          }
        }
      }
    `,
  },
})

interface RelayProps {
  me: {
    conversation: {
      id: string
      from: {
        name: string
        email: string
      }
      to: {
        name: string
      }
      artworks: any[]
      messages: {
        pageInfo?: {
          hasNextPage: boolean
        }
        edges: Array<
          {
            node: any | null
          }
        >
      }
    }
  }
}
