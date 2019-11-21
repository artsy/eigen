import { Box, Button } from "@artsy/palette"
import { HeaderFollowArtistMutation } from "__generated__/HeaderFollowArtistMutation.graphql"
import colors from "lib/data/colors"
import React from "react"
import { StyleSheet, TextStyle, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Schema, Track, track as _track } from "../../utils/track"
import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

import { Header_artist } from "__generated__/Header_artist.graphql"

interface Props {
  artist: Header_artist
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
    const artist = this.props.artist
    return (
      <Box px={2} pt={3}>
        <Headline style={[styles.base, styles.headline]}>{artist.name}</Headline>
        {this.renderByline()}
        {this.renderFollowersCount()}
        {this.renderFollowButton()}
      </Box>
    )
  }

  renderFollowButton() {
    if (this.props.artist.isFollowed !== null) {
      return (
        <Button
          variant={this.props.artist.isFollowed ? "secondaryOutline" : "primaryBlack"}
          block
          width={100}
          loading={this.state.isFollowedChanging}
          onPress={this.handleFollowChange.bind(this)}
        >
          {this.props.artist.isFollowed ? "Following" : "Follow"}
        </Button>
      )
    }
  }

  renderFollowersCount() {
    const count = this.state.followersCount
    const followerString = count + (count === 1 ? " Follower" : " Followers")
    return <SerifText style={[styles.base, styles.followCount]}>{followerString}</SerifText>
  }

  renderByline() {
    const artist = this.props.artist
    const bylineRequired = artist.nationality || artist.birthday
    if (bylineRequired) {
      return (
        <View>
          <SerifText style={styles.base}>{this.descriptiveString()}</SerifText>
        </View>
      )
    } else {
      return null
    }
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
        commitMutation<HeaderFollowArtistMutation>(relay.environment, {
          onCompleted: () => this.successfulFollowChange(),
          mutation: graphql`
            mutation HeaderFollowArtistMutation($input: FollowArtistInput!) {
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

interface Styles {
  base: TextStyle
  headline: TextStyle
  followCount: TextStyle
}

const styles = StyleSheet.create<Styles>({
  base: {
    textAlign: "center",
  },
  headline: {
    fontSize: 14,
  },
  followCount: {
    color: colors["gray-semibold"],
    marginBottom: 30,
  },
})

export default createFragmentContainer(Header, {
  artist: graphql`
    fragment Header_artist on Artist {
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
