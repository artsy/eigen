import { PartnerFollowButton_partner$data } from "__generated__/PartnerFollowButton_partner.graphql"
import { PartnerFollowButtonFollowMutation } from "__generated__/PartnerFollowButtonFollowMutation.graphql"
import { Schema, Track, track as _track } from "app/utils/track"
import { ButtonProps, FollowButton } from "palette"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  partner: PartnerFollowButton_partner$data
  relay: RelayProp
  size?: ButtonProps["size"]
}

interface State {
  isFollowedChanging: boolean
}

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
    const { slug: partnerSlug, profile } = partner
    // We can only follow partners who have a profile, so we can assume if the follow
    // button is rendered, then we do have a profile.
    const { isFollowed: partnerFollowed, internalID: profileID } = profile!

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<PartnerFollowButtonFollowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          onError: (e) => console.log("errors", e),
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
          // @ts-ignore RELAY 12 MIGRATION
          optimisticResponse: {
            followProfile: {
              profile: {
                id: profile!.id,
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

  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedChanging: false,
    })
  }

  render() {
    const { partner } = this.props

    return (
      <FollowButton
        haptic
        isFollowed={!!partner.profile?.isFollowed}
        onPress={this.handleFollowPartner.bind(this)}
      />
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
