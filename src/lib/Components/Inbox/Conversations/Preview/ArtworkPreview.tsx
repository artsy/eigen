import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import styled from "styled-components/native"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Colors } from "lib/data/colors"
import { color, Flex, Sans, Touchable } from "palette"

import { ArtworkPreview_artwork } from "__generated__/ArtworkPreview_artwork.graphql"
import { Schema, Track, track as _track } from "../../../../utils/track"

const Container = styled.View`
  flex-direction: column;
  background-color: ${color("black100")};
  border-radius: 15;
  overflow: hidden;
  margin-bottom: 5;
  flex: 1;
`

const ImageContainer = styled(Flex)`
  background-color: ${color("black10")};
  padding: 10px;
  flex: 1;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const TextContainer = styled(VerticalLayout)`
  align-self: center;
  padding: 10px;
`

const TitleAndDate = styled.View`
  margin-top: 3;
  margin-right: 12;
  flex-direction: row;
  justify-content: flex-start;
`
interface Props {
  artwork: ArtworkPreview_artwork
  onSelected?: () => void
}

const track: Track<Props> = _track

@track()
export class ArtworkPreview extends React.Component<Props> {
  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationAttachmentArtwork,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork.internalID,
    owner_slug: props.artwork.slug,
  }))
  attachmentSelected() {
    // @ts-ignore STRICTNESS_MIGRATION
    this.props.onSelected()
  }

  render() {
    const artwork = this.props.artwork
    const artworkImage = artwork.image

    return (
      <Touchable
        style={{ maxWidth: "66.67%" }}
        underlayColor={Colors.GrayLight}
        onPress={this.props.onSelected && this.attachmentSelected.bind(this)}
      >
        <Container>
          {!!artworkImage && (
            <ImageContainer>
              <OpaqueImageView aspectRatio={artworkImage.aspectRatio} imageURL={artworkImage.url} />
            </ImageContainer>
          )}
          <TextContainer>
            <Sans size="4" color="white100">
              {artwork.artist_names}
            </Sans>
            <TitleAndDate>
              {/* Nested Text components are necessary for the correct behaviour on both short and long titles + dates */}
              <Sans size="3" color="white100" numberOfLines={1} ellipsizeMode={"middle"}>
                {`${artwork.title}`}
                {`, ${artwork.date}`}
              </Sans>
            </TitleAndDate>
          </TextContainer>
        </Container>
      </Touchable>
    )
  }
}

export default createFragmentContainer(ArtworkPreview, {
  artwork: graphql`
    fragment ArtworkPreview_artwork on Artwork {
      slug
      internalID
      title
      artist_names: artistNames
      date
      image {
        url
        aspectRatio
      }
    }
  `,
})
