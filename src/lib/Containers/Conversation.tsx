import * as React from "react"
import * as Relay from "react-relay"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { FlatList, ImageURISource, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../data/colors"
import ArtworkPreview from "../Components/Inbox/Conversations/ArtworkPreview"
import Composer from "../Components/Inbox/Conversations/Composer"
import Message from "../Components/Inbox/Conversations/Message"
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
  renderMessage(message) {
    const artwork = this.props.me.conversation.artworks[0]
    return (
      <Message
        message={message.item}
        artworkPreview={
          !message.index &&
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
    const temporaryTimestamp = "11:00AM"

    // Ideally we will use a Relay fragment in the Message component, but for now this is good enough
    const messageData = conversation.messages.edges.map(({ node }, index) => {
      return {
        senderName: node.is_from_user ? conversation.from.name : partnerName,
        key: index,
        time: temporaryTimestamp,
        body: node.raw_text,
      }
    })

    return (
      <Container>
        <Header>
          <HeaderTextContainer>
            <BackButtonPlaceholder source={chevron} />
            <SmallHeadline>{partnerName}</SmallHeadline>
            <PlaceholderView />
          </HeaderTextContainer>
        </Header>
        <MessagesList
          data={messageData}
          renderItem={this.renderMessage.bind(this)}
          ItemSeparatorComponent={DottedBorder}
        />
        <ComposerContainer><Composer /></ComposerContainer>
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
            edges {
              node {
                raw_text
                is_from_user

              }
            }
          }
          artworks @relay (plural: true) {
            title
            artist_names
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
