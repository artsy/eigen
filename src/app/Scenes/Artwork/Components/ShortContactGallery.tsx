import { EntityHeader, EnvelopeIcon, Flex } from "@artsy/palette-mobile"
import { InquiryModal_me$key } from "__generated__/InquiryModal_me.graphql"
import { ShortContactGallery_artwork$key } from "__generated__/ShortContactGallery_artwork.graphql"
import { navigateToPartner } from "app/system/navigation/navigate"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, useFragment } from "react-relay"
import { ContactGalleryButton } from "./CommercialButtons/ContactGalleryButton"

interface ShortContactGalleryProps {
  artwork: ShortContactGallery_artwork$key
  me: InquiryModal_me$key
  partnerHref?: string
  partnerName?: string | null
  locationNames?: string | null
  showPartnerType?: boolean
}

export const ShortContactGallery: React.FC<ShortContactGalleryProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)

  return (
    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
      <TouchableWithoutFeedback
        onPress={() => {
          if (props.partnerHref) {
            navigateToPartner(props.partnerHref)
          }
        }}
      >
        <EntityHeader
          name={props.partnerName ?? ""}
          meta={props.locationNames ?? ""}
          style={{ flex: 1 }}
        />
      </TouchableWithoutFeedback>
      <ContactGalleryButton
        artwork={artworkData}
        me={props.me}
        variant="outline"
        size="small"
        icon={<EnvelopeIcon fill="black100" width="16px" height="16px" />}
      />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ShortContactGallery_artwork on Artwork {
    ...ContactGalleryButton_artwork
  }
`
