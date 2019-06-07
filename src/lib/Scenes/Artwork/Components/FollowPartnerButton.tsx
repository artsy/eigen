import { Sans } from "@artsy/palette"
import { FollowPartnerButton_artist } from "__generated__/FollowPartnerButton_artist.graphql"
import { FollowPartnerButtonMutation } from "__generated__/FollowPartnerButtonMutation.graphql"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  partner: FollowPartnerButton_partner
  relay: RelayProp
}

export class FollowPartnerButton extends React.Component<Props> {
  handleFollowPartner = () => {
    const { partner, relay } = this.props
    const {
      gravityID: partnerSlug,
      internalID: partnerID,
      id: partnerRelayID,
      profile: { is_followed: partnerFollowed, internalID: profileID },
    } = partner

    commitMutation<FollowPartnerButtonMutation>(relay.environment, {
      mutation: graphql`
        mutation FollowPartnerButtonMutation($input: FollowProfileInput!) {
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
    })
  }

  render() {
    const followButtonText = this.props.partner.profile.is_followed ? "Following" : "Follow"
    return (
      <>
        <Sans color="black60" size="6" mx={1}>
          &middot;
        </Sans>
        <TouchableWithoutFeedback onPress={this.handleFollowPartner.bind(this)}>
          <Sans color="black60" size="4">
            {followButtonText}
          </Sans>
        </TouchableWithoutFeedback>
      </>
    )
  }
}

export const FollowPartnerButtonFragmentContainer = createFragmentContainer(FollowPartnerButton, {
  partner: graphql`
    fragment FollowPartnerButton_partner on Partner {
      name
      gravityID
      internalID
      id
      href
      profile {
        internalID
        gravityID
        is_followed
      }
    }
  `,
})
