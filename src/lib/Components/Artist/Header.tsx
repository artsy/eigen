import React from "react"
import { Schema, Track, track as _track } from "../../utils/track"

import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, NativeModules, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
const { ARTemporaryAPIModule } = NativeModules

import colors from "lib/data/colors"
import InvertedButton from "../Buttons/InvertedButton"
import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

import { Header_artist } from "__generated__/Header_artist.graphql"

const isPad = Dimensions.get("window").width > 700

interface Props {
  artist: Header_artist
}

interface State {
  following: boolean
  followersCount: number
}

const track: Track<Props, State> = _track

@track()
class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      following: false,
      followersCount: props.artist.counts.follows as number,
    }
  }

  componentDidMount() {
    NativeModules.ARTemporaryAPIModule.followStatusForArtist(this.props.artist.internalID, (error, following) => {
      if (error) {
        // FIXME: Handle error
        console.error("Artist/Header.tsx", error.message)
      }
      this.setState({ following })
    })
  }

  render() {
    const artist = this.props.artist
    return (
      <View style={{ paddingTop: 20 }}>
        <Headline style={[styles.base, styles.headline]}>{artist.name}</Headline>
        {this.renderByline()}
        {this.renderFollowersCount()}
        {this.renderFollowButton()}
      </View>
    )
  }

  renderFollowButton() {
    if (this.state.following !== null) {
      return (
        <View style={styles.followButton}>
          <InvertedButton
            text={this.state.following ? "Following" : "Follow"}
            selected={this.state.following}
            onPress={this.handleFollowChange.bind(this)}
          />
        </View>
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

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionNames.ArtistUnfollow : Schema.ActionNames.ArtistFollow,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  handleFollowChange() {
    const newFollowersCount = this.state.following ? this.state.followersCount - 1 : this.state.followersCount + 1
    ARTemporaryAPIModule.setFollowArtistStatus(
      !this.state.following,
      this.props.artist.internalID,
      (error, following) => {
        if (error) {
          console.warn(error)
          this.failedFollowChange()
        } else {
          this.successfulFollowChange()
        }
        this.setState({ following, followersCount: newFollowersCount })
      }
    )
    this.setState({ following: !this.state.following, followersCount: newFollowersCount })
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  successfulFollowChange() {
    // callback for analytics purposes
  }

  @track((props, state) => ({
    action_name: state.following ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Fail,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  failedFollowChange() {
    // callback for analytics purposes
  }
}

interface Styles {
  base: TextStyle
  headline: TextStyle
  followCount: TextStyle
  followButton: ViewStyle
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
  followButton: {
    height: 40,
    width: isPad ? 330 : null,
    alignSelf: isPad ? "center" : null,
    marginLeft: 0,
    marginRight: 0,
  },
})

export default createFragmentContainer(Header, {
  artist: graphql`
    fragment Header_artist on Artist {
      internalID
      slug
      name
      nationality
      birthday
      counts {
        follows
      }
    }
  `,
})
