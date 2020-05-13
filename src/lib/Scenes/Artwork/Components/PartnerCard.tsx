import { Button, EntityHeader, Flex, Sans, Spacer } from "@artsy/palette"
import { PartnerCard_artwork } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardFollowMutation } from "__generated__/PartnerCardFollowMutation.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { get } from "lib/utils/get"
import { limitWithCount } from "lib/utils/limitWithCount"
import { Schema, Track, track as _track } from "lib/utils/track"
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

// @ts-ignore STRICTNESS_MIGRATION
const track: Track<Props, State> = _track

@track()
export class PartnerCard extends React.Component<Props, State> {
  state = { isFollowedChanging: false }

  @track({
    action_name: Schema.ActionNames.FollowPartner,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.PartnerContext,
  })
  handleFollowPartner() {
    const { artwork, relay } = this.props
    const {
      // @ts-ignore STRICTNESS_MIGRATION
      slug: partnerSlug,
      // @ts-ignore STRICTNESS_MIGRATION
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
                // @ts-ignore STRICTNESS_MIGRATION
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
    // @ts-ignore STRICTNESS_MIGRATION
    if (partner.type === "Auction House" || galleryOrBenefitAuction) {
      return null
    }
    const { isFollowedChanging } = this.state
    let locationNames = null
    // @ts-ignore STRICTNESS_MIGRATION
    const imageUrl = partner.profile && partner.profile.icon ? partner.profile.icon.url : null
    // @ts-ignore STRICTNESS_MIGRATION
    if (partner.cities) {
      // @ts-ignore STRICTNESS_MIGRATION
      locationNames = get(partner, p => limitWithCount(p.cities, 2), []).join(", ")
    }
    const showPartnerType =
      // @ts-ignore STRICTNESS_MIGRATION
      partner.type === "Institution" || partner.type === "Gallery" || partner.type === "Institutional Seller"
    // @ts-ignore STRICTNESS_MIGRATION
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
        <TouchableWithoutFeedback
          onPress={this.handleTap.bind(
            this,
            // @ts-ignore STRICTNESS_MIGRATION
            partner.href
          )}
        >
          <EntityHeader
            // @ts-ignore STRICTNESS_MIGRATION
            name={partner.name}
            // @ts-ignore STRICTNESS_MIGRATION
            href={partner.is_default_profile_public && partner.href}
            meta={locationNames || undefined}
            // @ts-ignore STRICTNESS_MIGRATION
            imageUrl={imageUrl}
            // @ts-ignore STRICTNESS_MIGRATION
            initials={partner.initials}
            // @ts-ignore STRICTNESS_MIGRATION
            FollowButton={
              // @ts-ignore STRICTNESS_MIGRATION
              partner.profile && (
                <Button
                  // @ts-ignore STRICTNESS_MIGRATION
                  variant={partner.profile.is_followed ? "secondaryOutline" : "primaryBlack"}
                  onPress={this.handleFollowPartner.bind(this)}
                  size="small"
                  longestText="Following"
                  loading={isFollowedChanging}
                >
                  {partner! /* STRICTNESS_MIGRATION */.profile.is_followed ? "Following" : "Follow"}
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
        cities
        is_default_profile_public: isDefaultProfilePublic
        type
        name
        slug
        id
        href
        initials
        profile {
          id
          internalID
          is_followed: isFollowed
          icon {
            url(version: "square140")
          }
        }
      }
    }
  `,
})
