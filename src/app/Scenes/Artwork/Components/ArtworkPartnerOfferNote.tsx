import { Flex, Text, useColor } from "@artsy/palette-mobile"
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
    <Flex flexDirection="row" p={1} backgroundColor="mono5">
      {!!partnerIcon && (
        <Flex mr={1}>
          <ImageBackground
            accessibilityLabel="Partner icon"
            source={{ uri: partnerIcon }}
            style={{ width: 30, height: 30 }}
            imageStyle={{
              borderRadius: 15,
              borderColor: color("mono30"),
              borderWidth: 1,
            }}
          />
        </Flex>
      )}

      <Flex flex={1}>
        <Text variant="sm-display" color="mono100" fontWeight="bold">
          Note from the gallery
        </Text>

        <Text variant="sm" color="mono100">
          “{note}”
        </Text>
      </Flex>
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworkPartnerOfferNote_artwork on Artwork {
    partner(shallow: true) {
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
