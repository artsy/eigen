import moment from "moment"
import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { MetadataText, PreviewText as P, SmallHeadline } from "../Typography"

import { StyleSheet, TouchableWithoutFeedback, ViewStyle } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"
import DottedLine from "../../../Components/DottedLine"
import OpaqueImageView from "../../OpaqueImageView"

const Card = styled.View`
  margin: 10px 20px 0;
  min-height: 80px;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const HorizontalLayout = styled.View`
  flex: 1;
  flex-direction: row;
`

const CardContent = styled(HorizontalLayout)`
  justify-content: space-between;
`

const TextPreview = styled(VerticalLayout)`
  margin-left: 15;
  margin-bottom: 15;
`

const DateHeading = styled(HorizontalLayout)`
  justify-content: flex-end;
  margin-bottom: 4;
`

const UnreadIndicator = styled.View`
  height: 8;
  width: 8;
  border-radius: 4;
  background-color: ${colors["purple-regular"]};
  margin-left: 4;
  margin-top: 3;
  margin-bottom: 3;
`

const Subtitle = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 16px;
  color: black;
  margin-top: 6;
  margin-bottom: 2;
`

const Title = styled(Subtitle)`
  font-family: ${fonts["garamond-italic"]};
`

const ImageView = styled(OpaqueImageView)`
  width: 58px;
  height: 58px;
  border-radius: 4px;
`

export interface Conversation {
  id: string | null
  to: {
    name: string | null
  }
  last_message: string | null
  last_message_at: string | null
  is_last_message_to_user: boolean
  last_message_open: string | null
  items: Array<{
    item: any
  }>
}

interface Props {
  conversation: Conversation
  onSelected?: () => void
}

export class ConversationSnippet extends React.Component<Props, any> {
  renderTitleForItem(item) {
    if (item.__typename === "Artwork") {
      const artworkTitle = `${item.title.trim()}, `
      const artworkDate = `${item.date}`
      const artworkArtist = `${item.artist_names} · `

      return (
        <HorizontalLayout>
          <P>
            <Subtitle>
              {artworkArtist}
            </Subtitle>
            <Title>
              {artworkTitle}
            </Title>
            <Subtitle>
              {artworkDate}
            </Subtitle>
          </P>
        </HorizontalLayout>
      )
    }

    if (item.__typename === "Show") {
      const name = item.fair ? item.fair.name : item.name
      return (
        <HorizontalLayout>
          <P>
            <Subtitle>
              {name}
            </Subtitle>
          </P>
        </HorizontalLayout>
      )
    }
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

    const conversationText = conversation.last_message.replace(/\n/g, " ")
    const date = moment(conversation.last_message_at).fromNow(true)
    return (
      <TouchableWithoutFeedback onPress={this.props.onSelected}>
        <Card>
          <CardContent>
            <ImageView imageURL={imageURL} />
            <TextPreview>
              <HorizontalLayout>
                <SmallHeadline>
                  {partnerName}
                </SmallHeadline>
                <DateHeading>
                  <MetadataText>
                    {date}
                  </MetadataText>
                  {conversation.is_last_message_to_user && !conversation.last_message_open && <UnreadIndicator />}
                </DateHeading>
              </HorizontalLayout>
              {this.renderTitleForItem(item)}
              <P>
                {conversationText}
              </P>
            </TextPreview>
          </CardContent>
          <DottedLine />
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
      last_message_open
      is_last_message_to_user
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

interface RelayProps {
  conversation: {
    id: string | null
    to: {
      name: string
    }
    last_message: string
    last_message_at: string | null
    is_last_message_to_user: boolean
    last_message_open: string | null
    __typename: string
    items: Array<{
      item: any
    } | null> | null
  }
}
