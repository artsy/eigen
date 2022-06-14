import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { ArtworkPreview_artwork$data } from "__generated__/ArtworkPreview_artwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ClassTheme, Flex, Text, Touchable } from "palette"

import { themeGet } from "@styled-system/theme-get"
import { Schema, Track, track as _track } from "app/utils/track"

const Container = styled.View`
  background-color: ${themeGet("colors.black100")};
  border-radius: 15;
  overflow: hidden;
  margin-bottom: 5;
`

const ImageContainer = styled(Flex)`
  background-color: ${themeGet("colors.black10")};
  padding: 10px;
  flex: 1;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
`

const TextContainer = styled(VerticalLayout)`
  align-self: flex-start;
  padding: 10px;
`

const TitleAndDate = styled.View`
  margin-top: 3;
  margin-right: 12;
  flex-direction: row;
  justify-content: flex-start;
`
interface Props {
  artwork: ArtworkPreview_artwork$data
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
    this.props.onSelected!()
  }

  render() {
    const artwork = this.props.artwork
    const artworkImage = artwork.image

    return (
      <ClassTheme>
        {({ color }) => (
          <Touchable
            underlayColor={color("black10")}
            onPress={this.props.onSelected && this.attachmentSelected.bind(this)}
          >
            <Container>
              {!!artworkImage && (
                <ImageContainer>
                  <OpaqueImageView
                    aspectRatio={artworkImage.aspectRatio}
                    imageURL={artworkImage.url}
                  />
                </ImageContainer>
              )}
              <TextContainer>
                <Text variant="sm" color="white100">
                  {artwork.artistNames}
                </Text>
                <TitleAndDate>
                  {/* Nested Text components are necessary for the correct behaviour on both short and long titles + dates */}
                  <Text variant="xs" color="white100" numberOfLines={1} ellipsizeMode="middle">
                    {`${artwork.title} / ${artwork.date}`}
                  </Text>
                </TitleAndDate>
              </TextContainer>
            </Container>
          </Touchable>
        )}
      </ClassTheme>
    )
  }
}

export default createFragmentContainer(ArtworkPreview, {
  artwork: graphql`
    fragment ArtworkPreview_artwork on Artwork {
      slug
      internalID
      title
      artistNames
      date
      image {
        url
        aspectRatio
      }
    }
  `,
})
