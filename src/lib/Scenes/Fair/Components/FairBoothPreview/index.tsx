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
      partner: { id: partnerSlug, _id: partnerID, __id: partnerRelayID, profile },
    } = show
    const isFollowed = !!profile ? profile.is_followed : null
    const _id = !!profile ? profile._id : null
    if (isFollowed === null || !_id) {
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
          mutation: graphql`
            mutation FairBoothPreviewMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  id
                  _id
                  isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              profile_id: _id,
              unfollow: isFollowed,
            },
          },
          optimisticResponse: {
            followProfile: {
              profile: {
                _id,
                id: partnerSlug,
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
    owner_id: props.show._id,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Gallery,
  }))
  trackOnViewFairBoothWorks() {
    const {
      show: { id: showID },
    } = this.props
    SwitchBoard.presentNavigationViewController(this, `show/${showID}?entity=fair-booth`)
  }

  @track(props => ({
    action_name: Schema.ActionNames.ListGallery,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show._id,
    owner_slug: props.show.id,
    owner_type: Schema.OwnerEntityTypes.Gallery,
  }))
  viewFairBoothPressed() {
    const {
      show: { id: showID },
    } = this.props
    SwitchBoard.presentNavigationViewController(this, `/show/${showID}?entity=fair-booth`)
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

export const FairBoothPreviewContainer = createFragmentContainer(
  FairBoothPreview,
  graphql`
    fragment FairBoothPreview_show on Show {
      id
      _id
      name
      is_fair_booth
      counts {
        artworks
      }
      partner {
        ... on Partner {
          name
          href
          id
          _id
          __id
          profile {
            _id
            is_followed
          }
        }
      }
      fair {
        name
      }
      cover_image {
        url
      }
      location {
        display
      }
      artworks_connection(first: 4) {
        edges {
          node {
            ...GenericGrid_artworks
          }
        }
      }
    }
  `
)
