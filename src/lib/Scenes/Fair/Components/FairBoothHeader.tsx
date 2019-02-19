import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { FairBoothHeader_show } from "__generated__/FairBoothHeader_show.graphql"
import { FairBoothHeaderMutation } from "__generated__/FairBoothHeaderMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
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

export class FairBoothHeader extends React.Component<Props, State> {
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
        commitMutation<FairBoothHeaderMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: false,
            })
          },
          mutation: graphql`
            mutation FairBoothHeaderMutation($input: FollowProfileInput!) {
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
        {boothLocation && (
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

export const FairBoothHeaderContainer = createFragmentContainer(
  FairBoothHeader,
  graphql`
    fragment FairBoothHeader_show on Show {
      fair {
        name
      }
      partner {
        ... on Partner {
          name
          id
          __id
          href
          profile {
            _id
            is_followed
          }
        }
        ... on ExternalPartner {
          name
          id
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
  `
)
