import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Schema, Track, track as _track } from "../../../utils/track"

import { TouchableHighlight } from "react-native"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Colors } from "lib/data/colors"
import styled from "styled-components/native"

import { color, Flex, Sans } from "@artsy/palette"
import { ConversationSnippet_conversation } from "__generated__/ConversationSnippet_conversation.graphql"

const Unread = styled(Flex)`
  height: 14;
  width: 14;
  border-radius: 7;
  background-color: ${Colors.White};
  position: absolute;
  left: -7;
  top: -7;
  z-index: 99;
  justify-content: center;
  align-items: center;
`

const Indicator = styled.View`
  height: 10;
  width: 10;
  border-radius: 5;
  background-color: ${Colors.PurpleRegular};
`

const ImageView = styled(OpaqueImageView)`
  width: 80px;
  height: 80px;
  border-radius: 2px;
`

export interface Props {
  conversation: ConversationSnippet_conversation
  onSelected?: () => void
}

const track: Track<Props, null, Schema.Entity> = _track

@track()
export class ConversationSnippet extends React.Component<Props> {
  // @ts-ignore STRICTNESS_MIGRATION
  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationSelected,
    owner_id: props.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  conversationSelected() {
    // @ts-ignore STRICTNESS_MIGRATION
    this.props.onSelected()
  }

  render() {
    const conversation = this.props.conversation
    // If we cannot resolve items in the conversation, such as deleted fair booths
    // prior to snapshotting them at time of inquiry (generally older conversations),
    // just skip over the entire conversation.
    // @ts-ignore STRICTNESS_MIGRATION
    if (conversation.items.length === 0) {
      console.warn(`Unable to load items for conversation with ID ${conversation.internalID}`)
      return null
    }

    // @ts-ignore STRICTNESS_MIGRATION
    const item = conversation.items[0].item

    let imageURL: string
    // @ts-ignore STRICTNESS_MIGRATION
    if (item.__typename === "Artwork") {
      // @ts-ignore STRICTNESS_MIGRATION
      imageURL = item.image && item.image.url
      // @ts-ignore STRICTNESS_MIGRATION
    } else if (item.__typename === "Show") {
      // @ts-ignore STRICTNESS_MIGRATION
      imageURL = item.coverImage && item.coverImage.url
    }

    const partnerName = conversation.to.name

    const conversationText = conversation.lastMessage && conversation.lastMessage.replace(/\n/g, " ")
    // @ts-ignore STRICTNESS_MIGRATION
    const date = moment(conversation.lastMessageAt).fromNow(true) + " ago"
    return (
      <TouchableHighlight onPress={() => this.conversationSelected()} underlayColor={color("black5")}>
        <Flex py={2} px={2}>
          <Flex flexDirection="row">
            <Flex>
              {!!conversation.unread && (
                <Unread>
                  <Indicator />
                </Unread>
              )}
              <ImageView
                imageURL={
                  // @ts-ignore STRICTNESS_MIGRATION
                  imageURL
                }
              />
            </Flex>
            <Flex ml={1} style={{ flex: 1 }} justifyContent="flex-start">
              <Flex flexDirection="row" mb="2px" style={{ flex: 0, alignItems: "center" }}>
                <Sans
                  size="3t"
                  weight="medium"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  mr="5px"
                  color={conversation.unread ? "black" : "black60"}
                  style={{ flex: 3 }}
                >
                  {partnerName}
                </Sans>
                <Sans size="3t" color="black30" style={{ flex: 1 }}>
                  {conversation.messagesConnection?.totalCount}
                </Sans>
                <Sans textAlign="right" size="3t" color="black30" style={{ flex: 0 }}>
                  {date}
                </Sans>
              </Flex>
              {!!conversationText && (
                <Sans
                  size="3t"
                  mr="15px"
                  ellipsizeMode="tail"
                  numberOfLines={3}
                  color={conversation.unread ? "black" : "black60"}
                >
                  {conversationText}
                </Sans>
              )}
            </Flex>
          </Flex>
        </Flex>
      </TouchableHighlight>
    )
  }
}

export default createFragmentContainer(ConversationSnippet, {
  conversation: graphql`
    fragment ConversationSnippet_conversation on Conversation {
      internalID
      to {
        name
      }
      lastMessage
      lastMessageAt
      unread
      items {
        item {
          __typename
          ... on Artwork {
            date
            title
            artistNames
            image {
              url
            }
          }
          ... on Show {
            fair {
              name
            }
            name
            coverImage {
              url
            }
          }
        }
      }
      messagesConnection {
        totalCount
      }
    }
  `,
})
