import { Button, EntityHeader, Flex, Sans, Spacer } from "@artsy/palette"
import { PartnerCard_artwork } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardFollowMutation } from "__generated__/PartnerCardFollowMutation.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { filterLocations } from "lib/utils/filterLocations"
import { get } from "lib/utils/get"
import { limitWithCount } from "lib/utils/limitWithCount"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artwork: PartnerCard_artwork
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

export class PartnerCard extends React.Component<Props, State> {
  state = { isFollowedChanging: false }
  handleFollowPartner = () => {
    const { artwork, relay } = this.props
    const {
      slug: partnerSlug,
      profile: { is_followed: partnerFollowed, internalID: profileID },
    } = artwork.partner

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<PartnerCardFollowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          onError: e => console.log("errors", e),
          mutation: graphql`
            mutation PartnerCardFollowMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  id
                  slug
                  internalID
                  is_followed: isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              profileID,
              unfollow: partnerFollowed,
            },
          },
          optimisticResponse: {
            followProfile: {
              profile: {
                id: artwork.partner.profile.id,
                internalID: profileID,
                slug: partnerSlug,
                is_followed: !partnerFollowed,
              },
            },
          },
        })
      }
    )
  }

  handleTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedChanging: false,
    })
  }

  render() {
    const { artwork } = this.props
    const { partner } = artwork
    const galleryOrBenefitAuction = artwork.sale && (artwork.sale.isBenefit || artwork.sale.isGalleryAuction)
    if (partner.type === "Auction House" || galleryOrBenefitAuction) {
      return null
    }
    const { isFollowedChanging } = this.state
    const imageUrl = partner.profile && partner.profile.icon ? partner.profile.icon.url : null
    const locationNames = get(partner, p => limitWithCount(filterLocations(p.locations), 2), []).join(", ")
    const showPartnerType =
      partner.type === "Institution" || partner.type === "Gallery" || partner.type === "Institutional Seller"
    const partnerTypeDisplayText = partner.type === "Gallery" ? "gallery" : "institution"
    return (
      <Flex>
        {showPartnerType && (
          <>
            <Sans size="3t" weight="medium">
              At {partnerTypeDisplayText}
            </Sans>
            <Spacer my={1} />
          </>
        )}
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this, partner.href)}>
          <EntityHeader
            name={partner.name}
            href={partner.is_default_profile_public && partner.href}
            meta={locationNames}
            imageUrl={imageUrl}
            initials={partner.initials}
            FollowButton={
              partner.profile && (
                <Button
                  variant={partner.profile.is_followed ? "secondaryOutline" : "primaryBlack"}
                  onPress={this.handleFollowPartner.bind(this)}
                  size="small"
                  longestText="Following"
                  loading={isFollowedChanging}
                >
                  {partner.profile.is_followed ? "Following" : "Follow"}
                </Button>
              )
            }
          />
        </TouchableWithoutFeedback>
      </Flex>
    )
  }
}

export const PartnerCardFragmentContainer = createFragmentContainer(PartnerCard, {
  artwork: graphql`
    fragment PartnerCard_artwork on Artwork {
      sale {
        isBenefit
        isGalleryAuction
      }
      partner {
        is_default_profile_public: isDefaultProfilePublic
        type
        name
        slug
        internalID
        id
        href
        initials
        profile {
          id
          internalID
          slug
          is_followed: isFollowed
          icon {
            url(version: "square140")
          }
        }
        locations {
          city
        }
      }
    }
  `,
})
