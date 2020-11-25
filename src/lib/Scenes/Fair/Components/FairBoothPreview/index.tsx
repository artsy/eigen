import { FairBoothPreview_show } from "__generated__/FairBoothPreview_show.graphql"
import { FairBoothPreviewMutation } from "__generated__/FairBoothPreviewMutation.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema, Track, track as _track } from "lib/utils/track"
import { Box } from "palette"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { FairBoothPreviewHeader } from "./Components/FairBoothPreviewHeader"

interface Props {
  show: FairBoothPreview_show
  relay: RelayProp
  width: number
}

interface State {
  isFollowedChanging: boolean
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<Props, State> = _track

@track()
export class FairBoothPreview extends React.Component<Props, State> {
  state = {
    isFollowedChanging: false,
  }

  @track((props, _, args) => {
    const slug = args[0]
    const internalID = args[1]
    const {
      show: {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        partner: { profile },
      },
    } = props
    const isFollowed = profile ? profile.isFollowed : null
    if (isFollowed === null) {
      return
    }
    const actionName = isFollowed ? Schema.ActionNames.GalleryFollow : Schema.ActionNames.GalleryUnfollow
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Success,
      owner_id: internalID,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Gallery,
    } as any
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  trackFollowPartner(_slug, _internalID) {
    return null
  }

  handleFollowPartner = () => {
    const { show, relay } = this.props
    const {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      partner: { slug: partnerSlug, internalID: partnerInternalID, id: partnerID, profile },
    } = show
    if (!profile) {
      return
    }
    const isFollowed = profile.isFollowed
    if (isFollowed === null) {
      return
    }
    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<FairBoothPreviewMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: false,
            })
            this.trackFollowPartner(partnerSlug, partnerInternalID)
          },
          mutation: graphql`
            mutation FairBoothPreviewMutation($input: FollowProfileInput!) {
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
              profileID: profile.internalID,
              unfollow: isFollowed,
            },
          },
          optimisticResponse: {
            followProfile: {
              profile: {
                id: profile.id,
                internalID: profile.internalID,
                slug: profile.slug,
                isFollowed: !isFollowed,
              },
            },
          },
          updater: (store) => {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            store.get(partnerID).setValue(!isFollowed, "isFollowed")
          },
        })
      }
    )
  }

  @track((props) => ({
    action_name: Schema.ActionNames.AllBoothWorks,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show.internalID,
    owner_slug: props.show.slug,
    owner_type: Schema.OwnerEntityTypes.Gallery,
  }))
  trackOnViewFairBoothWorks() {
    const {
      show: { slug: showSlug },
    } = this.props
    navigate(`show/${showSlug}?entity=fair-booth`)
  }

  @track((props) => ({
    action_name: Schema.ActionNames.ListGallery,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show.internalID,
    owner_slug: props.show.slug,
    owner_type: Schema.OwnerEntityTypes.Gallery,
  }))
  viewFairBoothPressed() {
    const {
      show: { slug: showSlug },
    } = this.props
    navigate(`/show/${showSlug}?entity=fair-booth`)
  }

  render() {
    const {
      show: {
        artworks,
        coverImage,
        location,
        partner,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        counts: { artworks: artworkCount },
      },
    } = this.props
    const display = !!location ? location.display : ""

    return (
      <Box my={1}>
        <FairBoothPreviewHeader
          onFollowPartner={this.handleFollowPartner}
          name={partner?.name || ""}
          location={display ?? undefined}
          isFollowed={Boolean(partner?.profile?.isFollowed)}
          isFollowedChanging={this.state.isFollowedChanging}
          url={(coverImage && coverImage.url) ?? undefined}
          onViewFairBoothPressed={this.viewFairBoothPressed.bind(this)}
        />
        <Box mt={1}>{<GenericGrid width={this.props.width} artworks={extractNodes(artworks)} />}</Box>
        <Box mt={2}>
          <CaretButton
            text={artworkCount > 1 ? `View all ${artworkCount} works` : `View 1 work`}
            onPress={() => this.trackOnViewFairBoothWorks()}
          />
        </Box>
      </Box>
    )
  }
}

export const FairBoothPreviewContainer = createFragmentContainer(FairBoothPreview, {
  show: graphql`
    fragment FairBoothPreview_show on Show {
      slug
      internalID
      counts {
        artworks
      }
      partner {
        ... on Partner {
          name
          href
          slug
          internalID
          id
          profile {
            id
            slug
            internalID
            isFollowed
          }
        }
      }
      coverImage {
        url
      }
      location {
        display
      }
      artworks: artworksConnection(first: 4) {
        edges {
          node {
            ...GenericGrid_artworks
          }
        }
      }
    }
  `,
})
