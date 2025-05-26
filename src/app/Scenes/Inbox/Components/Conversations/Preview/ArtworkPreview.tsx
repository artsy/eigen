import { Flex, Image, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import {
  ArtworkPreview_artwork$data,
  ArtworkPreview_artwork$key,
} from "__generated__/ArtworkPreview_artwork.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

const Container = styled.View`
  background-color: ${themeGet("colors.mono100")};
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 5px;
`

const ImageContainer = styled(Flex)`
  background-color: ${themeGet("colors.mono10")};
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
  artwork: ArtworkPreview_artwork$key
  onSelected?: () => void
}

export const ArtworkPreview: React.FC<ArtworkPreviewProps> = ({ artwork, onSelected }) => {
  const artworkData = useFragment(ArtworkPreviewFragment, artwork)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const { image: artworkImage } = artworkData
  const color = useColor()
  const { trackEvent } = useTracking()

  const attachmentSelected = () => {
    if (!onSelected) {
      return
    }

    onSelected()
    trackEvent(tracks.tapAttachmentSelected(artworkData))
  }

  return (
    <Touchable
      accessibilityRole="button"
      underlayColor={color("mono10")}
      onPress={attachmentSelected}
    >
      <Container>
        {!!artworkImage && (
          <ImageContainer>
            <Image
              src={artworkImage.url ?? ""}
              aspectRatio={artworkImage.aspectRatio}
              width={250}
              blurhash={showBlurhash ? artworkImage.blurhash : undefined}
            />
          </ImageContainer>
        )}
        <TextContainer>
          <Text variant="sm" color="mono0">
            {artworkData.artistNames}
          </Text>
          <TitleAndDate>
            {/* Nested Text components are necessary for the correct behaviour on both short and long titles + dates */}
            <Text variant="xs" color="mono0" numberOfLines={1} ellipsizeMode="middle">
              {`${artworkData.title} / ${artworkData.date}`}
            </Text>
          </TitleAndDate>
        </TextContainer>
      </Container>
    </Touchable>
  )
}

const ArtworkPreviewFragment = graphql`
  fragment ArtworkPreview_artwork on Artwork {
    slug
    internalID
    title
    artistNames
    date
    image {
      blurhash
      url
      aspectRatio
    }
  }
`

const tracks = {
  tapAttachmentSelected: (artwork: ArtworkPreview_artwork$data) => ({
    action_name: Schema.ActionNames.ConversationAttachmentArtwork,
    action_type: Schema.ActionTypes.Tap,
    owner_id: artwork.internalID,
    owner_slug: artwork.slug,
    owner_type: Schema.OwnerEntityTypes.Artwork,
  }),
}
