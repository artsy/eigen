import { Box, color, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistListItemFollowArtistMutation } from "__generated__/ArtistListItemFollowArtistMutation.graphql"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

const RoundedImage = styled(OpaqueImageView)`
  height: 45;
  width: 45;
  border-radius: 25;
  overflow: hidden;
`

const RoundedBox = styled(Box)`
  height: 45;
  width: 45;
  border-radius: 25;
  background-color: ${color("black10")};
  overflow: hidden;
`

const TightendSerif = styled(Serif)`
  position: relative;
  top: 2;
`

const TightendSans = styled(Sans)`
  position: relative;
  top: -2;
`

const StyledSerif = styled(Serif)`
  position: relative;
  top: 3;
`

const TextContainer = styled(Flex)`
  flex: 1;
`

interface Props {
  artist: ArtistListItem_artist
  relay: RelayProp
  Component?: any
}

interface State {
  isFollowedChanging: boolean
}

export const formatTombstoneText = (nationality, birthday, deathday) => {
  if (nationality && birthday && deathday) {
    return nationality + ", " + birthday + "-" + deathday
  } else if (nationality && birthday) {
    return nationality + ", b. " + birthday
  } else if (nationality) {
    return nationality
  } else if (birthday && deathday) {
    return birthday + "-" + deathday
  } else if (birthday) {
    return "b. " + birthday
  }
}

@track()
export class ArtistListItem extends React.Component<Props, State> {
  state = { isFollowedChanging: false }

  handleFollowArtist = () => {
    const {
      relay,
      artist: { id, __id, is_followed },
    } = this.props

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<ArtistListItemFollowArtistMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          mutation: graphql`
            mutation ArtistListItemFollowArtistMutation($input: FollowArtistInput!) {
              followArtist(input: $input) {
                artist {
                  __id
                  is_followed
                }
              }
            }
          `,
          variables: {
            input: {
              artist_id: id,
              unfollow: is_followed,
            },
          },
          optimisticResponse: {
            followArtist: {
              artist: {
                __id,
                is_followed: !is_followed,
              },
            },
          },
          updater: store => {
            store.get(__id).setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  @track((props: Props) => ({
    action_name: props.artist.is_followed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.artist._id,
    owner_slug: props.artist.id,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedChanging: false,
    })
  }

  renderText() {
    const {
      artist: { nationality, birthday, deathday, name },
    } = this.props
    if (nationality || birthday) {
      return (
        <>
          <TightendSerif size="3t">{name}</TightendSerif>
          <TightendSans size="3t" color="black60">
            {formatTombstoneText(nationality, birthday, deathday)}
          </TightendSans>
        </>
      )
    }
    if (!nationality) {
      return <Serif size="3t">{name}</Serif>
    }
  }

  getInitials = string => {
    const names = string.split(" ")
    let initials = names[0].substring(0, 1)
    if (names.length > 1) {
      initials += names[1].substring(0, 1)
    }
    return initials
  }

  render() {
    const { isFollowedChanging } = this.state
    const { artist } = this.props
    const { image, name } = artist
    const { is_followed } = artist

    return (
      <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
        {image && <RoundedImage imageURL={image.url} aspectRatio={1} />}
        {!image && (
          <RoundedBox>
            <Flex justifyContent="center" alignItems="center" flexGrow={1} alignContent="center" flexDirection="column">
              <StyledSerif color="black80" size="3">
                {this.getInitials(name)}
              </StyledSerif>
            </Flex>
          </RoundedBox>
        )}
        <Spacer m={1} />
        <TextContainer flexDirection="column" alignItems="flex-start">
          {this.renderText()}
        </TextContainer>
        <Spacer m={1} />
        <Box width={102} height={34}>
          <InvertedButton
            grayBorder={true}
            text={is_followed ? "Following" : "Follow"}
            onPress={this.handleFollowArtist}
            selected={is_followed}
            inProgress={isFollowedChanging}
          />
        </Box>
      </Flex>
    )
  }
}

export const ArtistListItemContainer = createFragmentContainer(
  ArtistListItem,
  graphql`
    fragment ArtistListItem_artist on Artist {
      __id
      _id
      id
      name
      is_followed
      nationality
      birthday
      deathday
      image {
        url
      }
    }
  `
)
