import { Button, ButtonSize } from "@artsy/palette"
import { PartnerFollowButton_partner } from "__generated__/PartnerFollowButton_partner.graphql"
import { PartnerFollowButtonFollowMutation } from "__generated__/PartnerFollowButtonFollowMutation.graphql"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  partner: PartnerFollowButton_partner
  relay: RelayProp
  followersCount?: number
  size?: ButtonSize
  setFollowersCount?: (followersCount: number) => void
}

interface State {
  isFollowedChanging: boolean
}

// @ts-ignore STRICTNESS_MIGRATION
const track: Track<Props, State> = _track

@track()
export class PartnerFollowButton extends React.Component<Props, State> {
  state = { isFollowedChanging: false }

  @track({
    action_name: Schema.ActionNames.FollowPartner,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.PartnerContext,
  })
  handleFollowPartner() {
    const { partner, relay } = this.props
    const {
      slug: partnerSlug,
      // @ts-ignore STRICTNESS_MIGRATION
      profile: { isFollowed: partnerFollowed, internalID: profileID },
    } = partner

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<PartnerFollowButtonFollowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(partnerFollowed),
          onError: e => console.log("errors", e),
          mutation: graphql`
            mutation PartnerFollowButtonFollowMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  id
                  slug
                  internalID
                  isFollowed
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
                id: partner.profile.id,
                internalID: profileID,
                slug: partnerSlug,
                isFollowed: !partnerFollowed,
              },
            },
          },
        })
      }
    )
  }

  // @ts-ignore STRICTNESS_MIGRATION
  handleShowSuccessfullyUpdated(partnerFollowed) {
    const { setFollowersCount, followersCount } = this.props
    if (setFollowersCount && followersCount) {
      partnerFollowed ? setFollowersCount(followersCount - 1) : setFollowersCount(followersCount + 1)
    }

    this.setState({
      isFollowedChanging: false,
    })
  }

  render() {
    const { partner } = this.props
    const { isFollowedChanging } = this.state
    return (
      <Button
        // @ts-ignore STRICTNESS_MIGRATION
        variant={partner.profile.isFollowed ? "secondaryOutline" : "primaryBlack"}
        onPress={this.handleFollowPartner.bind(this)}
        longestText="Following"
        loading={isFollowedChanging}
        size="small"
      >
        {partner.profile! /* STRICTNESS_MIGRATION */.isFollowed ? "Following" : "Follow"}
      </Button>
    )
  }
}

export const PartnerFollowButtonFragmentContainer = createFragmentContainer(PartnerFollowButton, {
  partner: graphql`
    fragment PartnerFollowButton_partner on Partner {
      internalID
      slug
      profile {
        id
        internalID
        isFollowed
      }
    }
  `,
})
