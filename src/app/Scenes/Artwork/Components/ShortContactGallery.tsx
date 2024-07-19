import { EntityHeader, EnvelopeIcon, Flex } from "@artsy/palette-mobile"
import { ShortContactGallery_artwork$key } from "__generated__/ShortContactGallery_artwork.graphql"
import { ShortContactGallery_me$key } from "__generated__/ShortContactGallery_me.graphql"
import { navigateToPartner } from "app/system/navigation/navigate"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, useFragment } from "react-relay"
import { ContactGalleryButton } from "./CommercialButtons/ContactGalleryButton"

interface ShortContactGalleryProps {
  artwork: ShortContactGallery_artwork$key
  me: ShortContactGallery_me$key
  partnerHref?: string
  partnerName?: string | null
  locationNames?: string | null
  showPartnerType?: boolean
}

export const ShortContactGallery: React.FC<ShortContactGalleryProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)
  const meData = useFragment(meFragment, props.me)

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
        me={meData}
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

const meFragment = graphql`
  fragment ShortContactGallery_me on Me {
    ...ContactGalleryButton_me
  }
`
