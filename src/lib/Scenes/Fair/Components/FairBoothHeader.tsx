import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { FairBoothHeader_show } from "__generated__/FairBoothHeader_show.graphql"
import { FairBoothHeaderMutation } from "__generated__/FairBoothHeaderMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { TouchableOpacity } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

interface Props {
  show: FairBoothHeader_show
  onTitlePressed: (id: string) => void
  relay: RelayProp
}

interface State {
  isFollowedChanging: boolean
}

const formatCounts = ({ artists, artworks }) => {
  const artistLabel = artists === 1 ? "artist" : "artists"
  const worksLabel = artworks === 1 ? "work" : "works"
  return `${artworks} ${worksLabel} by ${artists} ${artistLabel}`
}

const ButtonWrapper = styled(Box)`
  width: 100%;
  height: 85;
`

const track: Track<Props, State> = _track

@track()
export class FairBoothHeader extends React.Component<Props, State> {
  state = {
    isFollowedChanging: false,
  }

  @track((props, _, args) => {
    const partnerSlug = args[0]
    const partnerID = args[1]
    const {
      show: {
        partner: {
          profile: { is_followed: partnerFollowed },
        },
      },
    } = props
    const actionName = partnerFollowed ? Schema.ActionNames.GalleryFollow : Schema.ActionNames.GalleryUnfollow
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
      partner: {
        slug: partnerSlug,
        internalID: partnerID,
        id: partnerRelayID,
        profile: { is_followed: partnerFollowed, internalID: profileID },
      },
    } = show
    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<FairBoothHeaderMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: false,
            })
            this.trackFollowPartner(partnerSlug, partnerID)
          },
          mutation: graphql`
            mutation FairBoothHeaderMutation($input: FollowProfileInput!) {
              followProfile(input: $input) {
                profile {
                  slug
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
                slug: partnerSlug,
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
    const { show, onTitlePressed } = this.props
    const {
      partner: {
        name: partnerName,
        href: partnerHref,
        profile: { is_followed: partnerFollowed },
      },
      fair: { name: fairName },
      location: { display: boothLocation },
      counts,
    } = show
    const { isFollowedChanging } = this.state

    return (
      <Box pt={12} px={2}>
        <TouchableOpacity onPress={() => onTitlePressed(partnerHref)}>
          <Serif size="8">{partnerName}</Serif>
        </TouchableOpacity>
        <Spacer m={0.3} />
        <Sans weight="medium" size="3t">
          {fairName}
        </Sans>
        <Spacer m={0.5} />
        {!!boothLocation && (
          <>
            <Serif size="3t">{boothLocation}</Serif>
            <Spacer m={0.3} />
          </>
        )}
        <Sans size="3t" color="black60">
          {formatCounts(counts)}
        </Sans>
        <Spacer m={3} />
        <ButtonWrapper>
          <Spacer m={1} mt={1} />
          <InvertedButton
            inProgress={isFollowedChanging}
            text={partnerFollowed ? "Following gallery" : "Follow gallery"}
            selected={partnerFollowed}
            onPress={this.handleFollowPartner}
            grayBorder={true}
          />
          <Spacer m={1} />
        </ButtonWrapper>
      </Box>
    )
  }
}

export const FairBoothHeaderContainer = createFragmentContainer(FairBoothHeader, {
  show: graphql`
    fragment FairBoothHeader_show on Show {
      fair {
        name
      }
      partner {
        ... on Partner {
          name
          slug
          internalID
          id
          href
          profile {
            internalID
            slug
            is_followed
          }
        }
      }
      counts {
        artworks
        artists
      }
      location {
        display
      }
    }
  `,
})
