import * as React from "react"

import {
  MetadataText,
  PreviewText as P,
  SmallHeadline,
} from "../typography"

import {
  StyleSheet,
  ViewStyle,
} from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"
import OpaqueImageView from "../../opaque_image_view"

const Card = styled.View`
    marginLeft: 20
    marginRight: 20
    marginTop: 20
`

const VerticalLayout = styled.View`
    flex: 1
    flex-direction: column
`

const HorizontalLayout = styled.View`
    flex: 1
    flex-direction: row
`

const CardContent = HorizontalLayout.extend`
    justify-content: space-between
`

const TextPreview = VerticalLayout.extend`
    marginLeft: 15
`

const DateHeading = HorizontalLayout.extend`
    justify-content: flex-end
`

const UnreadIndicator = styled.View`
    height: 8
    width: 8
    borderRadius: 4
    background-color: ${colors["purple-regular"]}
    marginLeft: 4
    marginVertical: 3
`

const Separator = styled.View`
    height: 1
    width: 100%
    background-color: ${colors["gray-regular"]}
    marginTop: 20
`
const ArtworkSubtitle = styled.Text`
  font-family: ${fonts["garamond-regular"]}
  fontSize: 16
  color: black
  marginTop: 6
  marginBottom: 2
`

const ArtworkTitle = ArtworkSubtitle.extend`
  font-family: ${fonts["garamond-italic"]}
`

export default class ConversationSnippet extends React.Component<any, any> {

  render() {
    const conversation = this.props.conversation
    const artwork = conversation.artworks[0]

    const galleryName = conversation.to_name
    const artworkTitle = `${artwork.title}, `
    const artworkDate = `${artwork.date}`
    const artworkArtist = `${artwork.artist.name} · `
    const conversationText = conversation.last_message.replace(/\n/g, " ")
    const date = "11:00 AM"
    const imageURL = artwork.image.url

    return (
      <Card>
        <CardContent>
          <OpaqueImageView imageURL={imageURL} style={styles.image} />
          <TextPreview>
            <HorizontalLayout>
              <SmallHeadline>{galleryName}</SmallHeadline>
              <DateHeading>
                <MetadataText>{date}</MetadataText>
                <UnreadIndicator />
              </DateHeading>
            </HorizontalLayout>
            <HorizontalLayout>
              <ArtworkSubtitle>{artworkArtist}</ArtworkSubtitle>
              <ArtworkTitle>{artworkTitle}</ArtworkTitle>
              <ArtworkSubtitle>{artworkDate}</ArtworkSubtitle>
            </HorizontalLayout>
            <P>{conversationText}</P>
          </TextPreview>
        </CardContent>
        <Separator />
      </Card>
    )
  }
}

interface Styles {
  image: ViewStyle,
}

const styles = StyleSheet.create<Styles>({
  image: {
    width: 58,
    height: 58,
    borderRadius: 4,
  },
})
