import React from "react"
import { StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Button } from "@artsy/palette"
import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import SwitchBoard from "lib/NativeModules/SwitchBoard"

interface Props {
  artist: ArtistCard_artist
  onFollow?: (completion: (followStatus: boolean) => void) => void
}

interface State {
  processingChange: boolean
  following?: boolean
}

export class ArtistCard extends React.Component<Props, State> {
  state = {
    processingChange: false,
    following: null,
  }

  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href)
  }

  handleFollowChange = () => {
    this.setState({ processingChange: true })
    this.props.onFollow((followStatus: boolean) => {
      this.setState({ processingChange: false, following: followStatus })
    })
  }

  renderMetadata() {
    const artist = this.props.artist
    const lines = []

    lines.push(
      <Text key={1} numberOfLines={1} style={styles.sansSerifText}>
        {artist.name.toUpperCase()}
      </Text>
    )

    if (artist.formattedNationalityAndBirthday) {
      lines.push(
        <Text key={2} numberOfLines={1} style={styles.serifText}>
          {artist.formattedNationalityAndBirthday}
        </Text>
      )
    }

    if (artist.formattedArtworksCount) {
      lines.push(
        <Text key={3} numberOfLines={1} style={[styles.serifText, styles.serifWorksText]}>
          {artist.formattedArtworksCount}
        </Text>
      )
    }

    return lines
  }

  render() {
    const artist = this.props.artist
    const imageURL = artist.image && artist.image.url

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
          <View style={styles.touchableContainer}>
            <ImageView style={styles.image} imageURL={imageURL} />
            <View style={styles.textContainer}>{this.renderMetadata()}</View>
            <View style={styles.followButton}>
              <Button
                variant={this.state.following ? "secondaryOutline" : "primaryBlack"}
                onPress={this.handleFollowChange}
                size="small"
                block
                width={100}
                loading={this.state.processingChange}
              >
                {this.state.following ? "Following" : "Follow"}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle
  sansSerifText: TextStyle
  serifText: TextStyle
  touchableContainer: ViewStyle
  image: ViewStyle
  textContainer: ViewStyle
  serifWorksText: TextStyle
  followButton: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  // TODO: The outer wrapping view is currently only there because setting `marginLeft: 16` on the Artist card from the
  //      ArtistRail component isn’t working.
  container: {
    width: 236,
    height: 310,
  },
  touchableContainer: {
    backgroundColor: "#FFFFFF",
    width: 220,
    height: 280,
    marginLeft: 16,
    borderColor: "#F3F3F3",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  image: {
    width: 196,
    height: 148,
    marginTop: 12,
    marginLeft: 12,
  },
  textContainer: {
    marginLeft: 12,
    marginTop: 12,
  },
  sansSerifText: {
    marginRight: 12,
    height: 17,
    fontSize: 12,
    textAlign: "left",
    fontFamily: fonts["avant-garde-regular"],
  },
  serifText: {
    marginRight: 12,
    height: 17,
    fontFamily: "AGaramondPro-Regular",
    fontSize: 16,
    color: "#000000",
  },
  serifWorksText: {
    color: colors["gray-semibold"],
  },
  followButton: {
    marginTop: 12,
    marginLeft: 12,
    width: 196,
    height: 30,
    position: "absolute",
    bottom: 15,
  },
})

export const ArtistCardContainer = createFragmentContainer(ArtistCard, {
  artist: graphql`
    fragment ArtistCard_artist on Artist {
      id
      slug
      internalID
      href
      name
      formattedArtworksCount
      formattedNationalityAndBirthday
      image {
        url(version: "large")
      }
    }
  `,
})
