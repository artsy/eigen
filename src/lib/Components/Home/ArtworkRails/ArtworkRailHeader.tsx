import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import {
  Dimensions,
  NativeModules,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"
const { ARTemporaryAPIModule } = NativeModules

import Events from "lib/NativeModules/Events"

import Button from "lib/Components/Buttons/InvertedButton"
import SerifText from "lib/Components/Text/Serif"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import SectionTitle from "../SectionTitle"

import { ArtworkRailHeader_rail } from "__generated__/ArtworkRailHeader_rail.graphql"

const isPad = Dimensions.get("window").width > 700

const additionalContentRails = [
  "followed_artists",
  "saved_works",
  "live_auctions",
  "current_fairs",
  "genes",
  "generic_gene",
]

interface Props {
  rail: ArtworkRailHeader_rail
  handleViewAll: () => void
}

interface State {
  following: boolean
}

class ArtworkRailHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { following: props.rail.key === "followed_artist" }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.handleViewAll}>
        <View style={styles.container}>
          {this.props.rail.context && this.followAnnotation()}
          <SectionTitle>{this.props.rail.title}</SectionTitle>
          {this.actionButton()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  followAnnotation() {
    if (this.props.rail.key === "related_artists") {
      const name = this.props.rail.context.based_on.name
      return <SerifText style={styles.followAnnotation}>{"Based on " + name}</SerifText>
    }
  }

  hasAdditionalContent() {
    const moduleKey = this.props.rail.key
    return additionalContentRails.indexOf(moduleKey) > -1
  }

  actionButton() {
    if (this.hasAdditionalContent()) {
      return <Text style={styles.viewAllButton}> {"View All".toUpperCase()} </Text>
    } else if (this.props.rail.key === "related_artists" || this.props.rail.key === "followed_artist") {
      return (
        <View style={styles.followButton}>
          <Button
            text={this.state.following ? "Following" : "Follow"}
            selected={this.state.following}
            onPress={this.handleFollowChange}
          />
        </View>
      )
    }
  }

  handleFollowChange = () => {
    const context = this.props.rail.context
    ARTemporaryAPIModule.setFollowArtistStatus(!this.state.following, context.artist.slug, (error, following) => {
      if (error) {
        console.warn(error)
      } else {
        Events.postEvent({
          name: following ? "Follow artist" : "Unfollow artist",
          artist_id: context.artist.internalID,
          artist_slug: context.artist.slug,
          source_screen: "home page",
          context_module: "random suggested artist",
        })
      }
      this.setState({ following })
    })
  }
}

interface Styles {
  container: ViewStyle
  title: TextStyle
  viewAllButton: TextStyle
  followButton: ViewStyle
  followAnnotation: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: isPad ? 50 : 40,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  title: {
    marginTop: 10,
    fontSize: isPad ? 30 : 26,
    textAlign: "left",
  },
  viewAllButton: {
    fontFamily: fonts["avant-garde-regular"],
    fontSize: isPad ? 14 : 12,
    color: colors["gray-medium"],
    textAlign: "center",
    letterSpacing: 0.5,
  },
  followButton: {
    marginTop: 10,
    marginBottom: 0,
    alignSelf: "center",
    height: 30,
    width: 90,
  },
  followAnnotation: {
    fontStyle: "italic",
    alignSelf: "center",
    fontSize: 16,
  },
})

export default createFragmentContainer(ArtworkRailHeader, {
  rail: graphql`
    fragment ArtworkRailHeader_rail on HomePageArtworkModule {
      title
      key
      context {
        ... on HomePageModuleContextRelatedArtist {
          artist {
            slug
            internalID
          }
          based_on {
            name
          }
        }
      }
    }
  `,
})
