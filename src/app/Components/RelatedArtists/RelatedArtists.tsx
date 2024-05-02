import { Spacer } from "@artsy/palette-mobile"
import { RelatedArtists_artists$data } from "__generated__/RelatedArtists_artists.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { Stack } from "app/Components/Stack"
import { chunk } from "lodash"
import React from "react"
import { LayoutChangeEvent, View } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"

import RelatedArtist from "./RelatedArtist"

interface Props {
  artists: RelatedArtists_artists$data
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
    const isPadHorizontal = width > 900

    const columnCount = isTablet() ? (isPadHorizontal ? 4 : 3) : 2
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
        <Spacer y={2} />
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
