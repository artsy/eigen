import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Schema, Track, track as _track } from "../../../utils/track"

import { MetadataText, PreviewText as P, SmallHeadline } from "../Typography"

import { Dimensions, TouchableWithoutFeedback } from "react-native"

import OpaqueImageView from "lib/Components/OpaqueImageView"
import { Colors } from "lib/data/colors"
import { Fonts } from "lib/data/fonts"
import styled from "styled-components/native"

import { ConversationSnippet_conversation } from "__generated__/ConversationSnippet_conversation.graphql"

const isPad = Dimensions.get("window").width > 700

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const HorizontalLayout = styled.View`
  flex: 1;
  flex-direction: row;
`

const Card = styled.View`
  height: 120px;
  margin-left: 20px;
  margin-right: 20px;
`

const CardContent = styled(HorizontalLayout)`
  max-width: 708;
`

const TextPreview = styled(VerticalLayout)`
  margin-left: 10;
  max-height: 70px;
  align-self: center;
`

const DateHeading = styled(HorizontalLayout)`
  justify-content: flex-end;
`

const UnreadIndicator = styled.View`
  height: 8;
  width: 8;
  border-radius: 4;
  background-color: ${Colors.PurpleRegular};
  margin-left: 4;
  margin-top: 3;
  margin-bottom: 3;
`

const Subtitle = styled.Text`
  font-family: ${Fonts.GaramondRegular};
  font-size: 16px;
  color: black;
`

const Title = styled(Subtitle)`
  font-family: ${Fonts.GaramondItalic};
`

const ImageView = styled(OpaqueImageView)`
  width: 80px;
  height: 80px;
  border-radius: 2px;
  align-self: center;
`

const SeparatorLine = styled.View`
  height: 1;
  background-color: ${Colors.GrayRegular};
  width: 100%;
  ${isPad ? "align-self: center; width: 708;" : ""};
`

export interface Props {
  conversation: ConversationSnippet_conversation
  onSelected?: () => void
}

const track: Track<Props, null, Schema.Entity> = _track

@track()
export class ConversationSnippet extends React.Component<Props> {
  renderTitleForItem(item) {
    if (item.__typename === "Artwork") {
      const artworkTitle = `${item.title.trim()}, `
      const artworkDate = `${item.date}`
      const artworkArtist = `${item.artist_names} · `

      return (
        <HorizontalLayout>
          <P>
            <Subtitle>{artworkArtist}</Subtitle>
            <Title>{artworkTitle}</Title>
            <Subtitle>{artworkDate}</Subtitle>
          </P>
        </HorizontalLayout>
      )
    }

    if (item.__typename === "Show") {
      const name = item.fair ? item.fair.name : item.name
      return (
        <HorizontalLayout>
          <P>
            <Subtitle>{name}</Subtitle>
          </P>
        </HorizontalLayout>
      )
    }
  }

  @track(props => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationSelected,
    owner_id: props.conversation.id,
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
      console.warn(`Unable to load items for conversation with ID ${conversation.id}`)
      return null
    }

    const item = conversation.items[0].item

    let imageURL
    if (item.__typename === "Artwork") {
      imageURL = item.image.url
    } else if (item.__typename === "Show") {
      imageURL = item.cover_image.url
    }

    const partnerName = conversation.to.name

    const conversationText = conversation.last_message && conversation.last_message.replace(/\n/g, " ")
    const date = moment(conversation.last_message_at).fromNow(true) + " ago"
    return (
      <TouchableWithoutFeedback onPress={() => this.conversationSelected()}>
        <Card>
          <CardContent>
            <ImageView imageURL={imageURL} />
            <TextPreview>
              <HorizontalLayout>
                <SmallHeadline>{partnerName}</SmallHeadline>
                <DateHeading>{conversation.unread && <UnreadIndicator />}</DateHeading>
              </HorizontalLayout>
              {this.renderTitleForItem(item)}
              {!!conversationText && <P>{conversationText}</P>}
              <MetadataText>{date}</MetadataText>
            </TextPreview>
          </CardContent>
          <SeparatorLine />
        </Card>
      </TouchableWithoutFeedback>
    )
  }
}

export default createFragmentContainer(
  ConversationSnippet,
  graphql`
    fragment ConversationSnippet_conversation on Conversation {
      id
      to {
        name
      }
      last_message
      last_message_at
      unread
      items {
        item {
          __typename
          ... on Artwork {
            date
            title
            artist_names
            image {
              url
            }
          }
          ... on Show {
            fair {
              name
            }
            name
            cover_image {
              url
            }
          }
        }
      }
    }
  `
)
