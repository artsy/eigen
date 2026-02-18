import { Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ConversationSnippet_conversation$data } from "__generated__/ConversationSnippet_conversation.graphql"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { Schema } from "app/utils/track"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

import styled from "styled-components/native"

const Unread = styled(Flex)`
  height: 14px;
  width: 14px;
  border-radius: 7px;
  background-color: ${themeGet("colors.mono0")};
  position: absolute;
  left: -7px;
  top: -7px;
  z-index: 99;
  justify-content: center;
  align-items: center;
`

const Indicator = styled.View`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${themeGet("colors.blue100")};
`

const ImageView = styled(ImageWithFallback)`
  border-radius: 2px;
`

export interface Props {
  conversation: ConversationSnippet_conversation$data
  onSelected?: () => void
}

export const ConversationSnippet: React.FC<Props> = ({ conversation, onSelected }) => {
  const tracking = useTracking()
  const color = useColor()
  const conversationSelected = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.ConversationSelected,
      owner_id: conversation.internalID,
      owner_type: Schema.OwnerEntityTypes.Conversation,
    })

    onSelected?.()
  }

  // If we cannot resolve items in the conversation, such as deleted fair booths
  // prior to snapshotting them at time of inquiry (generally older conversations),
  // just skip over the entire conversation.
  if (!conversation.items || conversation.items.length === 0) {
    console.warn(`Unable to load items for conversation with ID ${conversation.internalID}`)
    return null
  }

  const item = conversation.items[0]?.item

  let imageURL: string | null | undefined
  let blurhash: string | null | undefined
  let exclusiveAccess = false
  if (item?.__typename === "Artwork") {
    imageURL = item.image?.url
    blurhash = item.image?.blurhash
    exclusiveAccess = item.isUnlisted
  } else if (item?.__typename === "Show") {
    imageURL = item.coverImage?.url
  }

  const partnerName = conversation.to.name

  const conversationText = conversation.lastMessage && conversation.lastMessage.replace(/\n/g, " ")
  const date = moment(conversation.lastMessageAt).fromNow(true) + " ago"

  return (
    <Touchable
      accessibilityRole="button"
      onPress={() => conversationSelected()}
      underlayColor={color("mono5")}
    >
      <Flex py={2} px={2}>
        <Flex flexDirection="row">
          <Flex>
            {!!conversation.unread && (
              <Unread>
                <Indicator />
              </Unread>
            )}
            <ImageView src={imageURL} blurhash={blurhash} width={80} height={80} />
          </Flex>
          <Flex ml={1} style={{ flex: 1 }}>
            <Flex flexDirection="row" mb="2px" style={{ flex: 0, alignItems: "center" }}>
              <Flex style={{ flexShrink: 1 }}>
                <Text
                  variant="sm"
                  weight="medium"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  mr="5px"
                  color={conversation.unread ? "mono100" : "mono60"}
                >
                  {partnerName}
                </Text>
              </Flex>
              <Flex flex={1} />
              <Flex>
                <Text variant="sm" textAlign="right" color="mono60">
                  {date}
                </Text>
              </Flex>
            </Flex>
            {!!exclusiveAccess && (
              <Text variant="sm" numberOfLines={1} mr="5px" color="mono100">
                Exclusive Access
              </Text>
            )}
            {!!conversationText && (
              <Text
                variant="sm"
                mr="15px"
                ellipsizeMode="tail"
                numberOfLines={3}
                color={conversation.unread ? "mono100" : "mono60"}
              >
                {conversationText}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  )
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
              blurhash
            }
            isUnlisted
          }
          ... on Show {
            fair {
              name
            }
            name
            coverImage {
              url
              blurhash
            }
          }
        }
      }
    }
  `,
})
