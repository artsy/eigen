import { VariableSizeShowsList_shows$data } from "__generated__/VariableSizeShowsList_shows.graphql"
import { Stack } from "app/Components/Stack"
import { chunk } from "lodash"
import { Component } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistShow } from "./ArtistShow"

interface Props {
  shows: VariableSizeShowsList_shows$data
  showSize: "medium" | "large"
}

interface State {
  width: number
  height: number
}

class ShowsList extends Component<Props, State> {
  state = {
    width: 1,
    height: 1,
  }

  imageDimensions(layout: { width: number }) {
    const width = layout.width
    const showSize = this.props.showSize

    const marginSpace = 20 * (this.numberOfColumns() - 1)
    const imageWidth = isTablet() ? (width - marginSpace) / this.numberOfColumns() : width

    const aspectRatio = showSize === "large" ? 1.6 : 1.4
    const imageHeight = Math.floor(imageWidth / aspectRatio)
    return { width: imageWidth, height: imageHeight }
  }

  numberOfColumns = () => {
    if (isTablet()) {
      return this.props.showSize === "large" ? 2 : 3
    }

    return 1
  }

  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    this.setState(this.imageDimensions(layout))
  }

  render() {
    const showStyles = StyleSheet.create({
      container: {
        width: this.state.width,
      },
      image: {
        width: this.state.width,
        height: this.state.height,
        marginBottom: 10,
      },
    })

    return (
      <View onLayout={this.onLayout}>
        <Stack>
          {chunk(this.props.shows, this.numberOfColumns()).map((shows, index) => (
            <Stack horizontal key={index} style={{ flex: 0 }}>
              {shows.map((show, index) => (
                <ArtistShow show={show} styles={showStyles} key={show.id} index={index} />
              ))}
            </Stack>
          ))}
        </Stack>
      </View>
    )
  }
}

export default createFragmentContainer(ShowsList, {
  shows: graphql`
    fragment VariableSizeShowsList_shows on Show @relay(plural: true) {
      id
      ...ArtistShow_show
    }
  `,
})
