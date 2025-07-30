import { EnvelopeIcon } from "@artsy/icons/native"
import { EntityHeader, Flex } from "@artsy/palette-mobile"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { ShortContactGallery_artwork$key } from "__generated__/ShortContactGallery_artwork.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { PartnerNavigationProps } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"
import { ContactGalleryButton } from "./CommercialButtons/ContactGalleryButton"

interface ShortContactGalleryProps {
  artwork: ShortContactGallery_artwork$key
  me: MyProfileEditModal_me$key & useSendInquiry_me$key
  partnerHref?: string
  partnerName?: string | null
  locationNames?: string | null
  showPartnerType?: boolean
}

export const ShortContactGallery: React.FC<ShortContactGalleryProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)

  return (
    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
      <RouterLink to={props.partnerHref} navigationProps={PartnerNavigationProps}>
        <EntityHeader
          name={props.partnerName ?? ""}
          meta={props.locationNames ?? ""}
          style={{ flex: 1 }}
        />
      </RouterLink>
      <ContactGalleryButton
        artwork={artworkData}
        me={props.me}
        variant="outline"
        size="small"
        icon={<EnvelopeIcon fill="mono100" width="16px" height="16px" />}
      />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ShortContactGallery_artwork on Artwork {
    ...ContactGalleryButton_artwork
  }
`
