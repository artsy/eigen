import { Box } from "@artsy/palette"
import { FairBoothPreview_show } from "__generated__/FairBoothPreview_show.graphql"
import { FairBoothPreviewMutation } from "__generated__/FairBoothPreviewMutation.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { FairBoothPreviewHeader } from "./Components/FairBoothPreviewHeader"

interface Props {
  show: FairBoothPreview_show
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

const track: Track<Props, State> = _track

@track()
export class FairBoothPreview extends React.Component<Props, State> {
  state = {
    isFollowedChanging: false,
  }

  @track((props, _, args) => {
    const partnerSlug = args[0]
    const partnerID = args[1]
    const {
      show: {
        partner: { profile },
      },
    } = props
    const isFollowed = profile ? profile.is_followed : null
    if (isFollowed === null) {
      return
    }
    const actionName = isFollowed ? Schema.ActionNames.GalleryFollow : Schema.ActionNames.GalleryUnfollow
    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Success,
      owner_id: partnerID,
      owner_slug: partnerSlug,
      owner_type: Schema.OwnerEntityTypes.Gallery,
    } as any
  })
  trackFollowPartner(_partnerSlug, _partnerID) {
    return null
  }

  handleFollowPartner = () => {
    const { show, relay } = this.props
    const {
      partner: { slug: partnerSlug, internalID: partnerID, id: partnerRelayID, profile },
    } = show
    const isFollowed = !!profile ? profile.is_followed : null
    const internalID = !!profile ? profile.internalID : null
    if (isFollowed === null || !internalID) {
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
            this.trackFollowPartner(partnerSlug, partnerID)
          },
          // TODO: Inputs to the mutation might have changed case of the keys!
          mutation: graphql`
            mutation FairBoothPreviewMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  slug
                  internalID
                  is_followed: isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              profile_id: internalID,
              unfollow: isFollowed,
            },
          },
          optimisticResponse: {
            followProfile: {
              profile: {
                internalID,
                slug: partnerSlug,
                is_followed: !isFollowed,
              },
            },
          },
          updater: store => {
            store.get(partnerRelayID).setValue(!isFollowed, "is_followed")
          },
        })
      }
    )
  }

  @track(props => ({
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
    SwitchBoard.presentNavigationViewController(this, `show/${showSlug}?entity=fair-booth`)
  }

  @track(props => ({
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
    SwitchBoard.presentNavigationViewController(this, `/show/${showSlug}?entity=fair-booth`)
  }

  render() {
    const {
      show: {
        artworks_connection,
        cover_image,
        location,
        partner: { name: partnerName, profile },
        counts: { artworks: artworkCount },
      },
    } = this.props
    const display = !!location ? location.display : ""

    return (
      <Box my={1}>
        <FairBoothPreviewHeader
          onFollowPartner={this.handleFollowPartner}
          name={partnerName}
          location={display}
          isFollowed={profile ? profile.is_followed : null}
          isFollowedChanging={this.state.isFollowedChanging}
          url={cover_image && cover_image.url}
          onViewFairBoothPressed={this.viewFairBoothPressed.bind(this)}
        />
        <Box mt={1}>{<GenericGrid artworks={artworks_connection.edges.map(a => a.node) as any} />}</Box>
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
      name
      is_fair_booth: isFairBooth
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
            internalID
            is_followed: isFollowed
          }
        }
      }
      fair {
        name
      }
      cover_image: coverImage {
        url
      }
      location {
        display
      }
      artworks_connection: artworksConnection(first: 4) {
        edges {
          node {
            ...GenericGrid_artworks
          }
        }
      }
    }
  `,
})
