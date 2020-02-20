import { Box, Button, Sans, Serif, Spacer } from "@artsy/palette"
import { ArtistHeader_artist } from "__generated__/ArtistHeader_artist.graphql"
import { ArtistHeaderFollowArtistMutation } from "__generated__/ArtistHeaderFollowArtistMutation.graphql"
import Events from "lib/NativeModules/Events"
import React from "react"
import { Text } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { Schema, Track, track as _track } from "../../utils/track"

interface Props {
  artist: ArtistHeader_artist
  relay: RelayProp
}

interface State {
  followersCount: number
  isFollowedChanging: boolean
}

const track: Track<Props, State> = _track

@track()
class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isFollowedChanging: false,
      followersCount: props.artist.counts.follows as number,
    }
  }

  render() {
    const { artist } = this.props
    const count = this.state.followersCount
    const followerString = count === 1 ? " Follower" : " Followers"
    const bylineRequired = artist.nationality || artist.birthday

    return (
      <Box px={2} pt={3}>
        <Serif style={{ textAlign: "center" }} size="5">
          {artist.name}
        </Serif>
        <Spacer mb={0.5} />
        {Boolean(count || bylineRequired) && (
          <>
            <TextWrapper style={{ textAlign: "center" }}>
              {bylineRequired && <Sans size="2">{this.descriptiveString()}</Sans>}
              {!!count && bylineRequired && (
                <Sans size="2">
                  {"  "}•{"  "}
                </Sans>
              )}
              {!!count && (
                <>
                  <Sans size="2" weight="medium">
                    {count.toLocaleString()}
                  </Sans>
                  <Sans size="2">{followerString}</Sans>
                </>
              )}
            </TextWrapper>
          </>
        )}
        <Spacer mb={2} />
        <Button
          variant={this.props.artist.isFollowed ? "secondaryOutline" : "primaryBlack"}
          block
          width={100}
          loading={this.state.isFollowedChanging}
          onPress={this.handleFollowChange.bind(this)}
        >
          {this.props.artist.isFollowed ? "Following" : "Follow"}
        </Button>
      </Box>
    )
  }

  descriptiveString() {
    const artist = this.props.artist
    const descriptiveString = (artist.nationality || "") + this.birthdayString()
    return descriptiveString
  }

  birthdayString() {
    const birthday = this.props.artist.birthday
    if (!birthday) {
      return ""
    }

    const leadingSubstring = this.props.artist.nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  @track(props => ({
    action_name: props.artist.isFollowed ? Schema.ActionNames.ArtistUnfollow : Schema.ActionNames.ArtistFollow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  handleFollowChange() {
    const {
      relay,
      artist: { slug, id, isFollowed },
    } = this.props
    const { isFollowedChanging } = this.state

    if (isFollowedChanging) {
      return
    }

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<ArtistHeaderFollowArtistMutation>(relay.environment, {
          onCompleted: () => this.successfulFollowChange(),
          mutation: graphql`
            mutation ArtistHeaderFollowArtistMutation($input: FollowArtistInput!) {
              followArtist(input: $input) {
                artist {
                  id
                  isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              artistID: slug,
              unfollow: isFollowed,
            },
          },
          optimisticResponse: {
            followArtist: {
              artist: {
                id,
                isFollowed: !isFollowed,
              },
            },
          },
          onError: () => this.failedFollowChange(),
        })
      }
    )
  }

  @track(props => ({
    action_name: props.artist.isFollowed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  successfulFollowChange() {
    // callback for analytics purposes
    Events.userHadMeaningfulInteraction()
    this.setState({
      isFollowedChanging: false,
    })
  }

  @track(props => ({
    action_name: props.artist.isFollowed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Fail,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  failedFollowChange() {
    // callback for analytics purposes
    this.setState({
      isFollowedChanging: false,
    })
  }
}

export default createFragmentContainer(Header, {
  artist: graphql`
    fragment ArtistHeader_artist on Artist {
      id
      internalID
      slug
      isFollowed
      name
      nationality
      birthday
      counts {
        follows
      }
    }
  `,
})

export const TextWrapper = styled(Text)``
