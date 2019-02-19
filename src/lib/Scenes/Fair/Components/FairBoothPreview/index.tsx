import { Box } from "@artsy/palette"
import { FairBoothPreview_show } from "__generated__/FairBoothPreview_show.graphql"
import { FairBoothPreviewMutation } from "__generated__/FairBoothPreviewMutation.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { FairBoothPreviewHeader } from "./Components/FairBoothPreviewHeader"

interface Props {
  show: FairBoothPreview_show
  onViewFairBoothPressed: () => void
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

export class FairBoothPreview extends React.Component<Props, State> {
  state = {
    isFollowedChanging: false,
  }

  handleFollowPartner = () => {
    const { show, relay } = this.props
    const {
      partner: {
        id: partnerSlug,
        __id: partnerRelayID,
        profile: { is_followed: partnerFollowed, _id: profileID },
      },
    } = show
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
          },
          mutation: graphql`
            mutation FairBoothPreviewMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  id
                  _id
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
                _id: profileID,
                id: partnerSlug,
                is_followed: !partnerFollowed,
              },
            },
          },
          updater: store => {
            store.get(partnerRelayID).setValue(!partnerFollowed, "is_followed")
          },
        })
      }
    )
  }

  render() {
    const {
      show: {
        artworks_connection,
        cover_image,
        location,
        partner: {
          name: partnerName,
          profile: { is_followed: partnerFollowed },
        },
      },
      onViewFairBoothPressed,
    } = this.props
    const display = !!location ? location.display : ""

    return (
      <Box my={1}>
        <FairBoothPreviewHeader
          onFollowPartner={this.handleFollowPartner}
          name={partnerName}
          location={display}
          isFollowed={partnerFollowed}
          isFollowedChanging={this.state.isFollowedChanging}
          url={cover_image && cover_image.url}
          onViewFairBoothPressed={() => onViewFairBoothPressed()}
        />
        <Box mt={1}>{<GenericGrid artworks={artworks_connection.edges.map(a => a.node) as any} />}</Box>
        <Box mt={2}>
          <CaretButton
            text={
              artworks_connection.edges.length > 1
                ? `View all ${artworks_connection.edges.length} works`
                : `View 1 work`
            }
            onPress={() => onViewFairBoothPressed()}
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
      name
      is_fair_booth
      partner {
        ... on Partner {
          name
          href
          id
          __id
          profile {
            _id
            is_followed
          }
        }
        ... on ExternalPartner {
          name
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
