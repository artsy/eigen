import { themeGet } from "@styled-system/theme-get"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Schema, Track, track as _track } from "app/utils/track"

import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import styled from "styled-components/native"

import { ConversationSnippet_conversation$data } from "__generated__/ConversationSnippet_conversation.graphql"
import { ClassTheme, Flex, Sans, Touchable } from "palette"

const Unread = styled(Flex)`
  height: 14;
  width: 14;
  border-radius: 7;
  background-color: ${themeGet("colors.white100")};
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
  background-color: ${themeGet("colors.blue100")};
`

const ImageView = styled(OpaqueImageView)`
  width: 80px;
  height: 80px;
  border-radius: 2px;
`

export interface Props {
  conversation: ConversationSnippet_conversation$data
  onSelected?: () => void
}

const track: Track<Props, null, Schema.Entity> = _track

@track()
export class ConversationSnippet extends React.Component<Props> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationSelected,
    owner_id: props.conversation.internalID,
    owner_type: Schema.OwnerEntityTypes.Conversation,
  }))
  conversationSelected() {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    this.props.onSelected()
  }

  render() {
    const conversation = this.props.conversation
    // If we cannot resolve items in the conversation, such as deleted fair booths
    // prior to snapshotting them at time of inquiry (generally older conversations),
    // just skip over the entire conversation.
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    if (conversation.items.length === 0) {
      console.warn(`Unable to load items for conversation with ID ${conversation.internalID}`)
      return null
    }

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const item = conversation.items[0].item

    let imageURL: string
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    if (item.__typename === "Artwork") {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      imageURL = item.image && item.image.url
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    } else if (item.__typename === "Show") {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      imageURL = item.coverImage && item.coverImage.url
    }

    const partnerName = conversation.to.name

    const conversationText =
      conversation.lastMessage && conversation.lastMessage.replace(/\n/g, " ")
    const date = moment(conversation.lastMessageAt).fromNow(true) + " ago"
    return (
      <ClassTheme>
        {({ color }) => (
          <Touchable onPress={() => this.conversationSelected()} underlayColor={color("black5")}>
            <Flex py={2} px={2}>
              <Flex flexDirection="row">
                <Flex>
                  {!!conversation.unread && (
                    <Unread>
                      <Indicator />
                    </Unread>
                  )}
                  <ImageView imageURL={imageURL} />
                </Flex>
                <Flex ml={1} style={{ flex: 1 }}>
                  <Flex flexDirection="row" mb="2px" style={{ flex: 0, alignItems: "center" }}>
                    <Flex style={{ flexShrink: 1 }}>
                      <Sans
                        size="3t"
                        weight="medium"
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        mr="5px"
                        color={conversation.unread ? "black" : "black60"}
                      >
                        {partnerName}
                      </Sans>
                    </Flex>
                    <Flex flex={1} />
                    <Flex>
                      <Sans textAlign="right" size="3t" color="black30">
                        {date}
                      </Sans>
                    </Flex>
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
          </Touchable>
        )}
      </ClassTheme>
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
