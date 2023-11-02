import { Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ArtworkPreview_artwork$data } from "__generated__/ArtworkPreview_artwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Schema } from "app/utils/track"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

const Container = styled.View`
  background-color: ${themeGet("colors.black100")};
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 5px;
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
  margin-top: 3px;
  margin-right: 12px;
  flex-direction: row;
  justify-content: flex-start;
`
export interface ArtworkPreviewProps {
  artwork: ArtworkPreview_artwork$data
  onSelected?: () => void
}

export const ArtworkPreview: React.FC<ArtworkPreviewProps> = ({ artwork, onSelected }) => {
  const { image: artworkImage } = artwork
  const color = useColor()
  const { trackEvent } = useTracking()

  const attachmentSelected = () => {
    if (!onSelected) {
      console.log("Hello world NOPE NOPE NOPE")
      return
    }
    onSelected()
    trackEvent(tracks.tapAttachmentSelected(artwork))
    console.log("Hello world YEP YEP YEP")
  }

  return (
    <Touchable underlayColor={color("black10")} onPress={attachmentSelected}>
      <Container>
        {!!artworkImage && (
          <ImageContainer>
            <OpaqueImageView aspectRatio={artworkImage.aspectRatio} imageURL={artworkImage.url} />
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
  )
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

const tracks = {
  tapAttachmentSelected: (artwork: ArtworkPreviewProps["artwork"]) => ({
    action_name: Schema.ActionNames.ConversationAttachmentArtwork,
    action_type: Schema.ActionTypes.Tap,
    owner_id: artwork.internalID,
    owner_slug: artwork.slug,
    owner_type: Schema.OwnerEntityTypes.Artwork,
  }),
}
