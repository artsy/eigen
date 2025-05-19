import { ButtonProps, FollowButton } from "@artsy/palette-mobile"
import { PartnerFollowButtonFollowMutation } from "__generated__/PartnerFollowButtonFollowMutation.graphql"
import { PartnerFollowButton_deprecated_partner$data } from "__generated__/PartnerFollowButton_deprecated_partner.graphql"
import { Schema, Track, track as _track } from "app/utils/track"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  partner: PartnerFollowButton_deprecated_partner$data
  relay: RelayProp
  size?: ButtonProps["size"]
}

interface State {
  isFollowedChanging: boolean
}

const track: Track<Props, State> = _track

/**
 * @deprecated in favor of PartnerFollowButtonWithSuspense
 * @reason moving away personalized data into different queries
 */
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { isFollowed: partnerFollowed, internalID: profileID, counts } = profile!

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
                  counts {
                    follows
                  }
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
                id: profile?.id,
                internalID: profileID,
                slug: partnerSlug,
                isFollowed: !partnerFollowed,
                counts: {
                  follows: partnerFollowed ? counts?.follows - 1 : counts?.follows + 1,
                },
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
        {...(partner.hasVisibleFollowsCount && {
          followCount: partner.profile?.counts?.follows,
          longestText: "Following 999.9k",
        })}
      />
    )
  }
}

export const PartnerFollowButtonFragmentContainer = createFragmentContainer(PartnerFollowButton, {
  partner: graphql`
    fragment PartnerFollowButton_deprecated_partner on Partner {
      internalID
      slug
      hasVisibleFollowsCount
      profile {
        id
        internalID
        isFollowed
        counts {
          follows
        }
      }
    }
  `,
})
