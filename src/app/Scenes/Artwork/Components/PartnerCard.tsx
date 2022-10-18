import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { navigateToPartner } from "app/navigation/navigate"
import { get } from "app/utils/get"
import { limitWithCount } from "app/utils/limitWithCount"
import { Track, track as _track } from "app/utils/track"
import { EntityHeader, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Questions } from "./Questions"

interface Props {
  artwork: PartnerCard_artwork$data
  relay: RelayProp
  shouldShowQuestions?: boolean
}

const track: Track<Props> = _track as any

@track()
export class PartnerCard extends React.Component<Props> {
  handleTap(href: string) {
    navigateToPartner(href)
  }

  render() {
    const { artwork, shouldShowQuestions } = this.props
    const partner = artwork.partner!
    const galleryOrBenefitAuction =
      artwork.sale && (artwork.sale.isBenefit || artwork.sale.isGalleryAuction)
    if (partner.type === "Auction House" || galleryOrBenefitAuction) {
      return null
    }
    let locationNames = null
    const imageUrl = partner.profile && partner.profile.icon ? partner.profile.icon.url : null
    if (partner.cities) {
      locationNames = get(partner, (p) => limitWithCount(p.cities as any, 2), [])!.join(", ")
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
            <Spacer my={1} />
          </>
        )}
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this, partner.href!)}>
          <EntityHeader
            name={partner.name!}
            href={(partner.isDefaultProfilePublic && partner.href) || undefined}
            meta={locationNames || undefined}
            imageUrl={imageUrl || undefined}
            initials={partner.initials || undefined}
          />
        </TouchableWithoutFeedback>
        <Spacer mt={2} />
        {!!shouldShowQuestions && <Questions artwork={artwork} />}
      </Flex>
    )
  }
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
