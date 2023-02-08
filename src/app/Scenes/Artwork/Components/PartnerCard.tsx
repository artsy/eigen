import { Spacer } from "@artsy/palette-mobile"
import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { navigateToPartner } from "app/system/navigation/navigate"
import { limitWithCount } from "app/utils/limitWithCount"
import { compact } from "lodash"
import { EntityHeader, Flex, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Questions } from "./Questions"

interface PartnerCardProps {
  artwork: PartnerCard_artwork$data
  relay: RelayProp
  shouldShowQuestions?: boolean
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ artwork, shouldShowQuestions }) => {
  const handleTap = (href: string) => navigateToPartner(href)

  const partner = artwork.partner!

  const galleryOrBenefitAuction = artwork.sale?.isBenefit ?? artwork.sale?.isGalleryAuction

  if (partner.type === "Auction House" || galleryOrBenefitAuction) {
    return null
  }

  let locationNames = null

  if (partner.cities) {
    const cities = compact(partner.cities ?? [])
    locationNames = limitWithCount(cities, 2).join(", ")
  }

  const showPartnerType =
    partner.type === "Institution" ||
    partner.type === "Gallery" ||
    partner.type === "Institutional Seller"

  const partnerTypeDisplayText = partner.type === "Gallery" ? partner.type : "Institution"

  return (
    <Flex>
      {!!showPartnerType && (
        <>
          <Text variant="md">{partnerTypeDisplayText}</Text>
          <Spacer y={1} />
        </>
      )}
      <TouchableWithoutFeedback onPress={() => handleTap(partner.href!)}>
        <EntityHeader
          name={partner.name!}
          href={(partner.isDefaultProfilePublic && partner.href) || undefined}
          meta={locationNames || undefined}
          imageUrl={partner.profile?.icon?.url || undefined}
          initials={partner.initials || undefined}
        />
      </TouchableWithoutFeedback>
      <Spacer y={2} />
      {!!shouldShowQuestions && <Questions artwork={artwork} />}
    </Flex>
  )
}

export const PartnerCardFragmentContainer = createFragmentContainer(PartnerCard, {
  artwork: graphql`
    fragment PartnerCard_artwork on Artwork {
      ...Questions_artwork
      sale {
        isBenefit
        isGalleryAuction
      }
      partner {
        cities
        isDefaultProfilePublic
        type
        name
        slug
        id
        href
        initials
        profile {
          id
          internalID
          icon {
            url(version: "square140")
          }
        }
      }
    }
  `,
})
