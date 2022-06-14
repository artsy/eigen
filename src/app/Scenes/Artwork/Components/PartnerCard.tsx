import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardFollowMutation } from "__generated__/PartnerCardFollowMutation.graphql"
import { navigateToPartner } from "app/navigation/navigate"
import { get } from "app/utils/get"
import { limitWithCount } from "app/utils/limitWithCount"
import { Schema, Track, track as _track } from "app/utils/track"
import { EntityHeader, Flex, FollowButton, Sans, Spacer } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artwork: PartnerCard_artwork$data
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

const track: Track<Props, State> = _track as any

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

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<PartnerCardFollowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          onError: (e) => console.log("errors", e),
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
              profileID: artwork.partner?.profile?.internalID!,
              unfollow: artwork.partner?.profile?.is_followed,
            },
          },
          // @ts-ignore RELAY 12 MIGRATION
          optimisticResponse: {
            followProfile: {
              profile: {
                id: artwork.partner?.profile?.id!,
                internalID: artwork.partner?.profile?.internalID!,
                slug: artwork.partner?.slug!,
                is_followed: !artwork.partner?.profile?.is_followed,
              },
            },
          },
        })
      }
    )
  }

  handleTap(href: string) {
    navigateToPartner(href)
  }

  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedChanging: false,
    })
  }

  render() {
    const { artwork } = this.props
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
    const partnerTypeDisplayText = partner.type === "Gallery" ? "gallery" : "institution"
    return (
      <Flex>
        {!!showPartnerType && (
          <>
            <Sans size="4t">At {partnerTypeDisplayText}</Sans>
            <Spacer my={1} />
          </>
        )}
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this, partner.href!)}>
          <EntityHeader
            name={partner.name!}
            href={(partner.is_default_profile_public && partner.href) || undefined}
            meta={locationNames || undefined}
            imageUrl={imageUrl || undefined}
            initials={partner.initials || undefined}
            FollowButton={
              (partner.profile && (
                <FollowButton
                  haptic
                  isFollowed={!!partner!.profile.is_followed}
                  onPress={this.handleFollowPartner.bind(this)}
                />
              )) ||
              undefined
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
