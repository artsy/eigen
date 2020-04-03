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

const UnreadIndicator = styled.View`
  height: 8;
  width: 8;
  border-radius: 4;
  margin-left: 10;
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
  renderTitleForItem(item: ConversationSnippet_conversation["items"][0]["item"]) {
    if (item.__typename === "Artwork") {
      return <>Inquiry on {item.artistNames}</>
    }

    if (item.__typename === "Show") {
      const name = item.fair ? item.fair.name : item.name
      return name
    }
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationSelected,
    owner_id: props.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  conversationSelected() {
    this.props.onSelected()
  }

  render() {
    const conversation = this.props.conversation
    // If we cannot resolve items in the conversation, such as deleted fair booths
    // prior to snapshotting them at time of inquiry (generally older conversations),
    // just skip over the entire conversation.
    if (conversation.items.length === 0) {
      console.warn(`Unable to load items for conversation with ID ${conversation.internalID}`)
      return null
    }

    const item = conversation.items[0].item

    let imageURL: string
    if (item.__typename === "Artwork") {
      imageURL = item.image && item.image.url
    } else if (item.__typename === "Show") {
      imageURL = item.coverImage && item.coverImage.url
    }

    const partnerName = conversation.to.name

    const conversationText = conversation.lastMessage && conversation.lastMessage.replace(/\n/g, " ")
    const date = moment(conversation.lastMessageAt).fromNow(true) + " ago"
    return (
      <TouchableHighlight onPress={() => this.conversationSelected()} underlayColor={color("black5")}>
        <Flex px={2} py={1}>
          <Flex flexDirection="row">
            <ImageView imageURL={imageURL} />
            <Flex ml={1} style={{ flex: 1 }} justifyContent="flex-start">
              <Flex flexDirection="row" style={{ flex: 0, alignItems: "center" }}>
                <Sans size="3t" weight="medium" ellipsizeMode="tail" numberOfLines={1} style={{ flex: 1 }}>
                  {partnerName}
                </Sans>
                {conversation.unread && <UnreadIndicator />}
              </Flex>
              <Sans size="3t" ellipsizeMode="tail" numberOfLines={1} weight="medium">
                {this.renderTitleForItem(item)}
              </Sans>
              {!!conversationText && (
                <Sans size="3" ellipsizeMode="tail" numberOfLines={1} color="black60">
                  {conversationText}
                </Sans>
              )}
              <Sans textAlign="right" size="2" color="black60" style={{ flex: 0 }}>
                {date}
              </Sans>
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
    }
  `,
})
