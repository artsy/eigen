import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { LayoutChangeEvent, View } from "react-native"

import RelatedArtist from "./RelatedArtist"

import { RelatedArtists_artists } from "__generated__/RelatedArtists_artists.graphql"
import { chunk } from "lodash"
import { SectionTitle } from "../SectionTitle"
import { Stack } from "../Stack"

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

  layoutState(currentLayout: { width: number }): State {
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
    const rows = chunk(this.props.artists, this.state.columns)
    return (
      <View onLayout={this.onLayout.bind(this)}>
        <SectionTitle title="Related artists" />
        <Stack>
          {rows.map((row, index) => (
            <Stack horizontal key={index}>
              {row.map((artist) => (
                <RelatedArtist key={artist.id} artist={artist} imageSize={this.state.imageSize} />
              ))}
            </Stack>
          ))}
        </Stack>
      </View>
    )
  }
}

export default createFragmentContainer(RelatedArtists, {
  artists: graphql`
    fragment RelatedArtists_artists on Artist @relay(plural: true) {
      id
      ...RelatedArtist_artist
    }
  `,
})
