import NetInfo from "@react-native-community/netinfo"
import { Conversation_me } from "__generated__/Conversation_me.graphql"
import { ConversationQuery } from "__generated__/ConversationQuery.graphql"
import ConnectivityBanner from "lib/Components/ConnectivityBanner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import Composer from "lib/Scenes/Inbox/Components/Conversations/Composer"
import Messages from "lib/Scenes/Inbox/Components/Conversations/Messages"
import { sendConversationMessage } from "lib/Scenes/Inbox/Components/Conversations/SendConversationMessage"
import { updateConversation } from "lib/Scenes/Inbox/Components/Conversations/UpdateConversation"
import { GlobalStore } from "lib/store/GlobalStore"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema, Track, track as _track } from "lib/utils/track"
import { color, Flex, Text, Touchable } from "palette"
import React from "react"
import { View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { ConversationDetailsQueryRenderer } from "./ConversationDetails"

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 22px;
  flex-direction: column;
  margin-bottom: 18px;
`

// This makes it really easy to style the HeaderTextContainer with space-between
const PlaceholderView = View

const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
`

interface Props {
  me: Conversation_me
  relay: RelayProp
  onMessageSent?: (text: string) => void
  navigator: NavigatorIOS
}

interface State {
  sendingMessage: boolean
  isConnected: boolean
  markedMessageAsRead: boolean
  fetchingData: boolean
  failedMessageText: string | null
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<Props, State> = _track

@track()
export class Conversation extends React.Component<Props, State> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  messages: MessagesComponent
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  composer: Composer

  // Assume if the component loads, connection exists (this way the banner won't flash unnecessarily)
  state = {
    sendingMessage: false,
    isConnected: true,
    markedMessageAsRead: false,
    fetchingData: false,
    failedMessageText: null,
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectivityChange)
    this.maybeMarkLastMessageAsRead()
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener("connectionChange", this.handleConnectivityChange)
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected })
  }

  maybeMarkLastMessageAsRead() {
    const conversation = this.props.me.conversation
    if (conversation?.unread && !this.state.markedMessageAsRead) {
      updateConversation(
        this.props.relay.environment,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        conversation,
        conversation.lastMessageID,
        (_response) => {
          this.setState({ markedMessageAsRead: true })
          GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
        },
        (error) => {
          console.warn(error)
          this.setState({ markedMessageAsRead: true })
          GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
        }
      )
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.ConversationSendReply,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    owner_id: props.me.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageSuccessfullySent(text: string) {
    this.setState({ sendingMessage: false })

    if (this.props.onMessageSent) {
      this.props.onMessageSent(text)
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props) => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.ConversationSendReply,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    owner_id: props.me.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  messageFailedToSend(error: Error, text: string) {
    console.warn(error)
    this.setState({ sendingMessage: false, failedMessageText: text })
  }

  render() {
    const conversation = this.props.me.conversation
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const partnerName = conversation.to.name
    const artworkSlug =
      conversation?.items?.[0]?.item && conversation?.items?.[0]?.item.__typename === "Artwork"
        ? conversation?.items?.[0]?.item?.slug
        : null
    const showOfferableInquiryButton =
      conversation?.items?.[0]?.item?.__typename === "Artwork" && conversation?.items?.[0]?.item?.isOfferableFromInquiry

    return (
      <Composer
        disabled={this.state.sendingMessage || !this.state.isConnected}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        ref={(composer) => (this.composer = composer)}
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        value={this.state.failedMessageText}
        artworkID={artworkSlug}
        isOfferableFromInquiry={showOfferableInquiryButton}
        onSubmit={(text) => {
          this.setState({ sendingMessage: true, failedMessageText: null })
          sendConversationMessage(
            this.props.relay.environment,
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            conversation,
            text,
            (_response) => {
              this.messageSuccessfullySent(text)
            },
            (error) => {
              this.messageFailedToSend(error, text)
            }
          )
          this.messages.scrollToLastMessage()
        }}
      >
        <Container>
          <Header>
            <Flex flexDirection="row" alignSelf="stretch" mx="2">
              <HeaderTextContainer>
                <Text variant="mediumText">{partnerName}</Text>
                <PlaceholderView />
              </HeaderTextContainer>
              <Touchable
                onPress={() => {
                  this.props.navigator.push({
                    component: ConversationDetailsQueryRenderer,
                    title: "",
                    passProps: {
                      conversationID: this.props.me?.conversation?.internalID,
                    },
                  })
                }}
              >
                <Svg width={28} height={28} viewBox="0 0 28 28">
                  <Path
                    d="M6.5 21.5V6.5H16L16 21.5H6.5ZM17.5 21.5H21.5V6.5H17.5L17.5 21.5ZM5 5.5C5 5.22386 5.22386 5 5.5 5H22.5C22.7761 5 23 5.22386 23 5.5V22.5C23 22.7761 22.7761 23 22.5 23H5.5C5.22386 23 5 22.7761 5 22.5V5.5Z"
                    fill={color("black100")}
                    fillRule="evenodd"
                  />
                </Svg>
              </Touchable>
            </Flex>
          </Header>
          {!this.state.isConnected && <ConnectivityBanner />}
          <Messages
            componentRef={(messages) => (this.messages = messages)}
            conversation={conversation as any}
            onDataFetching={(loading) => {
              this.setState({ fetchingData: loading })
            }}
          />
        </Container>
      </Composer>
    )
  }
}

export const ConversationFragmentContainer = createFragmentContainer(Conversation, {
  me: graphql`
    fragment Conversation_me on Me {
      conversation(id: $conversationID) {
        items {
          item {
            __typename
            ... on Artwork {
              href
              slug
              isOfferableFromInquiry
            }
            ... on Show {
              href
            }
          }
        }
        internalID
        id
        lastMessageID
        unread
        to {
          name
        }
        from {
          email
        }
        ...Messages_conversation
      }
    }
  `,
})

export const ConversationQueryRenderer: React.FC<{
  conversationID: string
  navigator: NavigatorIOS
}> = (props) => {
  const { conversationID, navigator } = props
  return (
    <QueryRenderer<ConversationQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ConversationQuery($conversationID: String!) {
          me {
            ...Conversation_me
          }
        }
      `}
      variables={{
        conversationID,
      }}
      render={renderWithLoadProgress(ConversationFragmentContainer, { navigator })}
    />
  )
}
