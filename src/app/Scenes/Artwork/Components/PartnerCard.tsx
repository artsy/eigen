import { Spacer, Flex, Text, EntityHeader } from "@artsy/palette-mobile"
import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { ShortContactGallery } from "app/Scenes/Artwork/Components/ShortContactGallery"
import { useConditionalNavigateToPartner } from "app/system/newNavigation/useConditionalNavigateToPartner"
import { limitWithCount } from "app/utils/limitWithCount"
import { compact } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Questions } from "./Questions"

interface PartnerCardProps {
  artwork: PartnerCard_artwork$data
  relay: RelayProp
  shouldShowQuestions?: boolean
  showShortContactGallery?: boolean
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  artwork,
  shouldShowQuestions,
  showShortContactGallery,
}) => {
  const conditionNavigateToPartner = useConditionalNavigateToPartner()
  const handleTap = (href: string) => conditionNavigateToPartner(href)

  const partner = artwork.partner

  const galleryOrBenefitAuction = artwork.sale?.isBenefit ?? artwork.sale?.isGalleryAuction

  if (!partner) {
    return null
  }

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

  if (showShortContactGallery) {
    return (
      <ShortContactGallery
        artwork={artwork}
        showPartnerType={showPartnerType}
        partnerName={partner.name}
        partnerHref={partner.href ?? undefined}
        locationNames={locationNames}
      />
    )
  }

  return (
    <Flex>
      {!!showPartnerType && (
        <>
          <Text variant="md">{partnerTypeDisplayText}</Text>
          <Spacer y={1} />
        </>
      )}
      <TouchableWithoutFeedback
        onPress={() => {
          if (partner.href) {
            handleTap(partner.href)
          }
        }}
      >
        <EntityHeader
          name={partner.name ?? ""}
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
      ...ShortContactGallery_artwork
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
