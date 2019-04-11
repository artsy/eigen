import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { LayoutChangeEvent, StyleSheet, TextStyle, View, ViewStyle } from "react-native"

import SerifText from "../Text/Serif"
import RelatedArtist from "./RelatedArtist"

import { RelatedArtists_artists } from "__generated__/RelatedArtists_artists.graphql"

interface Props {
  artists: RelatedArtists_artists
}

interface State {
  columns: number
  imageSize: {
    width: number
    height: number
  }
}

class RelatedArtists extends React.Component<Props, State> {
  state = {
    columns: 0,
    imageSize: {
      width: 1,
      height: 1,
    },
  }

  layoutState(currentLayout): State {
    const width = currentLayout.width
    const isPad = width > 600
    const isPadHorizontal = width > 900

    const columnCount = isPad ? (isPadHorizontal ? 4 : 3) : 2
    const marginWidth = 20
    const totalMargins = marginWidth * (columnCount - 1)

    const imageWidth = (width - totalMargins) / columnCount
    const imageHeight = imageWidth / 1.5

    return {
      columns: columnCount,
      imageSize: {
        width: Math.floor(imageWidth),
        height: Math.floor(imageHeight),
      },
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const newLayoutState = this.layoutState(event.nativeEvent.layout)
    if (this.state.columns !== newLayoutState.columns) {
      this.setState(newLayoutState)
    }
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>
        <SerifText style={styles.heading}>Related Artists</SerifText>
        <View style={styles.artistContainer}>{this.renderArtists()}</View>
      </View>
    )
  }

  renderArtists() {
    const artists = this.props.artists
    const artistViews = artists.map(artist => {
      return <RelatedArtist key={artist.__id} artist={artist as any} imageSize={this.state.imageSize} />
    })

    const numberOfTrailingViews = artists.length % this.state.columns
    if (numberOfTrailingViews > 0) {
      const extraRequiredViews = this.state.columns - numberOfTrailingViews
      for (let i = 0; i < extraRequiredViews; i++) {
        artistViews.push(<View key={"related-artist-spacer-" + i} style={this.state.imageSize} />)
      }
    }

    return artistViews
  }
}

interface Styles {
  container: ViewStyle
  artistContainer: ViewStyle
  heading: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "column",
  },
  artistContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginTop: 12,
    marginLeft: -10,
    marginRight: -10,
  },
  heading: {
    fontSize: 20,
  },
})

export default createFragmentContainer(RelatedArtists, {
  artists: graphql`
    fragment RelatedArtists_artists on Artist @relay(plural: true) {
      __id
      ...RelatedArtist_artist
    }
  `,
})
