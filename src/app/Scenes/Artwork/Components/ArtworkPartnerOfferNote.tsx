import { Box, Flex, Text, useColor } from "@artsy/palette-mobile"
import { ArtworkPartnerOfferNote_artwork$key } from "__generated__/ArtworkPartnerOfferNote_artwork.graphql"
import { ArtworkPartnerOfferNote_partnerOffer$key } from "__generated__/ArtworkPartnerOfferNote_partnerOffer.graphql"
import { ImageBackground } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArtworkPartnerOfferNoteProps {
  artwork: ArtworkPartnerOfferNote_artwork$key
  partnerOffer: ArtworkPartnerOfferNote_partnerOffer$key
}

export const ArtworkPartnerOfferNote: React.FC<ArtworkPartnerOfferNoteProps> = ({
  artwork,
  partnerOffer,
}) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const partnerOfferData = useFragment(partnerOfferFragment, partnerOffer)

  const color = useColor()

  const note = partnerOfferData?.note
  const partnerIcon = artworkData.partner?.profile?.icon?.url
  const noLongerAvailable = !partnerOfferData?.isAvailable

  if (!!noLongerAvailable || !note) {
    return null
  }

  return (
    <Flex flexDirection="row" p={1} backgroundColor="black5">
      {!!partnerIcon && (
        <Flex mr={1}>
          <ImageBackground
            accessibilityLabel="Partner icon"
            source={{ uri: partnerIcon }}
            style={{ width: 30, height: 30 }}
            imageStyle={{
              borderRadius: 15,
              borderColor: color("black30"),
              borderWidth: 1,
            }}
          />
        </Flex>
      )}

      <Box>
        <Text variant="sm-display" color="black100" fontWeight="bold">
          Note from the gallery
        </Text>

        <Text variant="sm" color="black100">
          “{note}”
        </Text>
      </Box>
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworkPartnerOfferNote_artwork on Artwork {
    partner {
      profile {
        icon {
          url(version: "square140")
        }
      }
    }
  }
`

const partnerOfferFragment = graphql`
  fragment ArtworkPartnerOfferNote_partnerOffer on PartnerOfferToCollector {
    note
    isAvailable
  }
`
