import * as PropTypes from "prop-types"
import * as React from "react"
import * as Relay from "react-relay"
import track from "react-tracking"
// import { TrackingPropType } from "react-tracking"

import { Dimensions, NativeModules, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
const { ARTemporaryAPIModule } = NativeModules

import Events from "../../NativeModules/Events"

import colors from "../../../data/colors"
import InvertedButton from "../Buttons/InvertedButton"
import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

const isPad = Dimensions.get("window").width > 700

interface HeaderProps extends React.Props<Header> {
  artist: any
}

interface State {
  following: boolean
  followersCount: number
}

// IMPORTANT: Have to decorate the whole component with a @track
// In order to add the tracking props to this component (via a HOC)
@track()
class Header extends React.Component<HeaderProps, State> {
  static propTypes = {
    artist: PropTypes.shape({
      name: PropTypes.string,
      nationality: PropTypes.string,
      birthday: PropTypes.string,
      counts: PropTypes.shape({
        follows: PropTypes.number,
      }),
    }),
  }

  constructor(props) {
    super(props)
    this.state = { following: false, followersCount: props.artist.counts.follows }
  }

  componentDidMount() {
    NativeModules.ARTemporaryAPIModule.followStatusForArtist(this.props.artist._id, (error, following) => {
      this.setState({ following })
    })
  }

  @track({ action: "press follow/unfollow button" })
  handleFollowChange() {
    const newFollowersCount = this.state.following ? this.state.followersCount - 1 : this.state.followersCount + 1
    ARTemporaryAPIModule.setFollowArtistStatus(!this.state.following, this.props.artist._id, (error, following) => {
      if (error) {
        console.error(error)
      } else {
        this.successfulFollowChange()
      }
      this.setState({ following, followersCount: newFollowersCount })
    })
    this.setState({ following: !this.state.following, followersCount: newFollowersCount })
  }

  // currently you can't get state yet, but leaving this in as desired usage
  @track((props, state) => ({ name: state.following, artist_id: props.artist._id, artist_slug: props.artist.id }))
  successfulFollowChange() {
    Events.postEvent(this, {
      name: this.state.following ? "Follow artist" : "Unfollow artist",
      artist_id: this.props.artist._id,
      artist_slug: this.props.artist.id,
      // TODO At some point, this component might be on other screens.
      source_screen: "artist page",
    })
  }

  render() {
    const artist = this.props.artist
    return (
      <View style={{ paddingTop: 20 }}>
        <Headline style={[styles.base, styles.headline]}>
          {artist.name}
        </Headline>
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
    return (
      <SerifText style={[styles.base, styles.followCount]}>
        {followerString}
      </SerifText>
    )
  }

  renderByline() {
    const artist = this.props.artist
    const bylineRequired = artist.nationality || artist.birthday
    if (bylineRequired) {
      return (
        <View>
          <SerifText style={styles.base}>
            {this.descriptiveString()}
          </SerifText>
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

export default Relay.createContainer(Header, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        _id
        id
        name
        nationality
        birthday
        counts {
          follows
        }
      }
    `,
  },
})

interface RelayProps {
  artist: {
    _id: string
    id: string
    name: string | null
    nationality: string | null
    birthday: string | null
    counts: {
      follows: boolean | number | string | null
    } | null
  }
}
