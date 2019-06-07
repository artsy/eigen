import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import { PartnerCard_artwork } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardMutation } from "__generated__/PartnerCardMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
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
    const image = partner.profile.icon.url
    // const image = "www.artsy.net"
    const showPartnerFollow = partner.type !== "Auction House" && partner.profile
    return (
      <Flex>
        {!!image && <RoundedImage imageURL={image} aspectRatio={1} />}
        {!image && (
          <RoundedBox>
            <Flex justifyContent="center" alignItems="center" flexGrow={1} alignContent="center" flexDirection="column">
              <StyledSerif color="black80" size="3">
                {partner.initials}
              </StyledSerif>
            </Flex>
          </RoundedBox>
        )}
        <Serif size="2">{partner.name}</Serif>
        <Box width={102} height={34}>
          <InvertedButton
            grayBorder={true}
            text={partner.profile.is_followed ? "Following" : "Follow"}
            onPress={this.handleFollowPartner}
            selected={partner.profile.is_followed}
            inProgress={isFollowedChanging}
          />
        </Box>
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
