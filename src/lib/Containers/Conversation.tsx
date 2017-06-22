import * as React from "react"
import * as Relay from "react-relay"

import { MetadataText, SmallHeadline } from "../Components/Inbox/Typography"

import { FlatList, ImageURISource, ViewProperties } from "react-native"
import ReversedFlatList from "react-native-reversed-flat-list"

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

interface State {
  messages?: any[]
}

export class Conversation extends React.Component<RelayProps, State> {
  constructor(props) {
    super(props)
    this.state = { messages: [] }
  }

  componentDidMount() {
    this.setState({ messages: this.formattedMessages() })
  }

  isFromUser(message) {
    /**
     * this is a quick hacky way to alternate between user/partner messages; will be changed once we have actual email
     * data
     */
    return message.from_email_address === this.props.me.conversation.from.email
  }

  renderMessage(message) {
    const artwork = this.props.me.conversation.artworks[0]
    const isFirstMessage = message.index === this.state.messages.length - 1
    return (
      <Message
        message={message.item}
        artworkPreview={
          isFirstMessage &&
          <ArtworkPreview
            artwork={artwork}
            onSelected={() => ARSwitchBoard.presentNavigationViewController(this, artwork.href)}
          />
        }
      />
    )
  }

  formattedMessages() {
    // Ideally we will use a Relay fragment in the Message component, but for now this is good enough
    const conversation = this.props.me.conversation
    const temporaryTimestamp = "11:00AM"

    return conversation.messages.edges.map(({ node }, index) => {
      return {
        senderName: this.isFromUser(node) ? conversation.from.name : this.props.me.conversation.to.name,
        key: index,
        time: temporaryTimestamp,
        body: node.snippet,
      }
    })
  }

  render() {
    const conversation = this.props.me.conversation
    const partnerName = conversation.to.name
    const artwork = conversation.artworks[0]

    return (
      <Container>
        <Header>
          <HeaderTextContainer>
            <BackButtonPlaceholder source={chevron} />
            <SmallHeadline>{partnerName}</SmallHeadline>
            <PlaceholderView />
          </HeaderTextContainer>
        </Header>
        <ReversedFlatList
          data={this.state.messages}
          renderItem={this.renderMessage.bind(this)}
          ItemSeparatorComponent={DottedBorder}
        />
        <ComposerContainer>
          <Composer
            onSubmit={text => {
              this.props.relay.commitUpdate(
                new AppendConversationThread({
                  from: this.props.me.conversation.from.email,
                  id: this.props.me.conversation.id,
                  body_text: text,
                })
              )

              /// This part is highly experimental; will be updated when we implement real pagination
              this.props.relay.setVariables({ totalSize: this.props.relay.variables.totalSize + 1 }, readyState => {
                if (readyState.done) {
                  const messages = this.formattedMessages()
                  messages.push({
                    senderName: this.props.me.conversation.from.name,
                    key: this.state.messages.length,
                    time: "1:00PM",
                    body: text,
                  })
                  this.setState({
                    messages,
                  })
                }
              })
            }}
          />
        </ComposerContainer>
      </Container>
    )
  }
}

interface MutationProps {
  from?: string
  id?: string
  body_text?: string
}

class AppendConversationThread extends Relay.Mutation<MutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { appendConversationThread }`
  }

  getVariables() {
    return {
      id: this.props.id,
      from: this.props.from,
      body_text: this.props.body_text,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AppendConversationThreadMutationPayload {
          messageEdge
          conversation {
            id
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
        parentID: this.props.id,
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
      conversation: {
        id: this.props.id,
      },
      messageEdge: {
        body_text: this.props.body_text,
        from: this.props.from,
      },
    }
  }
}

export default Relay.createContainer(Conversation, {
  initialVariables: {
    totalSize: 20,
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
          messages(first: $totalSize) {
            edges {
              node {
                snippet
                from_email_address
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
  relay: any
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
