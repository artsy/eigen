import { Box, color, EntityHeader, Flex, Sans, Serif } from "@artsy/palette"
import { PartnerCard_artwork } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardMutation } from "__generated__/PartnerCardMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { filterLocations } from "lib/utils/filterLocations"
import { get } from "lib/utils/get"
import { limitWithCount } from "lib/utils/limitWithCount"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  artwork: PartnerCard_artwork
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

const RoundedBox = styled(Box)`
  height: 45;
  width: 45;
  border-radius: 25;
  background-color: ${color("black10")};
  overflow: hidden;
`

const RoundedImage = styled(OpaqueImageView)`
  height: 45;
  width: 45;
  border-radius: 25;
  overflow: hidden;
`
const StyledSerif = styled(Serif)`
  position: relative;
  top: 3;
`

export class PartnerCard extends React.Component<Props, State> {
  state = { isFollowedChanging: false }
  handleFollowPartner = () => {
    const { artwork, relay } = this.props
    const {
      gravityID: partnerSlug,
      internalID: partnerID,
      id: partnerRelayID,
      profile: { is_followed: partnerFollowed, internalID: profileID },
    } = artwork.partner

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<PartnerCardMutation>(relay.environment, {
          mutation: graphql`
            mutation PartnerCardMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  gravityID
                  internalID
                  is_followed
                }
              }
            }
          `,
          variables: {
            input: {
              profile_id: profileID,
              unfollow: partnerFollowed,
            },
          },
          optimisticResponse: {
            followProfile: {
              profile: {
                internalID: profileID,
                gravityID: partnerSlug,
                is_followed: !partnerFollowed,
              },
            },
          },
          updater: store => {
            // store.get(id).setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  render() {
    const { isFollowedChanging } = this.state
    const { artwork } = this.props
    const partner = this.props.artwork.partner
    console.log("PROFILE", partner)

    const showPartnerLogo = !(artwork.sale && (artwork.sale.isBenefit || artwork.sale.isGalleryAuction))
    const imageUrl = partner.profile.icon.url
    // const image = "www.artsy.net"
    const partnerInitials = partner.initials
    const locationNames = get(partner, p => limitWithCount(filterLocations(p.locations), 2), []).join(", ")
    const showPartnerFollow = partner.type !== "Auction House" && partner.profile
    return (
      <Flex>
        <EntityHeader
          name={partner.name}
          href={partner.is_default_profile_public && `${partner.href}`}
          meta={locationNames}
          imageUrl={imageUrl}
          initials={partnerInitials}
          FollowButton={
            showPartnerFollow && (
              <InvertedButton
                grayBorder={true}
                text={partner.profile.is_followed ? "Following" : "Follow"}
                onPress={this.handleFollowPartner.bind(this)}
                selected={partner.profile.is_followed}
                inProgress={isFollowedChanging}
              />
            )
          }
        />
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
        is_default_profile_public
        type
        name
        gravityID
        internalID
        id
        href
        initials
        profile {
          internalID
          gravityID
          is_followed
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
