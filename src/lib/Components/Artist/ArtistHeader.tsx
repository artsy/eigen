import { Box, Button, Flex, Sans, Spacer } from "@artsy/palette"
import { ArtistHeader_artist } from "__generated__/ArtistHeader_artist.graphql"
import { ArtistHeaderFollowArtistMutation } from "__generated__/ArtistHeaderFollowArtistMutation.graphql"
import { userHadMeaningfulInteraction } from "lib/NativeModules/Events"
import { formatText } from "lib/utils/formatText"
import React from "react"
import { Text } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"
import { Schema, track } from "../../utils/track"

interface Props {
  artist: ArtistHeader_artist
  relay: RelayProp
}

interface State {
  followersCount: number
  isFollowedChanging: boolean
}

@track()
class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isFollowedChanging: false,
      followersCount: props.artist.counts?.follows ?? 0,
    }
  }

  render() {
    const { artist } = this.props
    const followersCount = this.state.followersCount
    const bylineRequired = artist.nationality || artist.birthday

    return (
      <Box px={2} pt={6} pb={1}>
        <Sans size="8">{artist.name}</Sans>
        <Spacer mb={1} />
        {Boolean(followersCount || bylineRequired) && (
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Flex>
              {!!bylineRequired && <Sans size="3t">{this.descriptiveString()}</Sans>}
              <Sans size="3t">
                {formatText(artist.counts?.artworks ?? 0, "work")}
                {"  "}•{"  "}
                {formatText(artist.counts?.follows ?? 0, "follower")}
              </Sans>
            </Flex>
            <Flex flexGrow={0} flexShrink={0}>
              <Button
                variant={this.props.artist.isFollowed ? "secondaryOutline" : "primaryBlack"}
                loading={this.state.isFollowedChanging}
                onPress={this.handleFollowChange.bind(this)}
                size="small"
                longestText="Following"
              >
                {this.props.artist.isFollowed ? "Following" : "Follow"}
              </Button>
            </Flex>
          </Flex>
        )}
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
    userHadMeaningfulInteraction()
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
        artworks
        follows
      }
    }
  `,
})

export const TextWrapper = styled(Text)``
