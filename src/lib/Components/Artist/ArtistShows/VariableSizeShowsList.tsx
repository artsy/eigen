import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"

import { VariableSizeShowsList_shows } from "__generated__/VariableSizeShowsList_shows.graphql"
import { isPad } from "lib/utils/hardware"
import ArtistShow from "./ArtistShow"

interface Props {
  shows: VariableSizeShowsList_shows
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
    const imageWidth = isPad() ? (width - marginSpace) / this.numberOfColumns() : width

    const aspectRatio = showSize === "large" ? 1.6 : 1.4
    const imageHeight = Math.floor(imageWidth / aspectRatio)
    return { width: imageWidth, height: imageHeight }
  }

  numberOfColumns = () => {
    if (isPad()) {
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
        marginBottom: 10,
        width: this.state.width,
      },
      image: {
        width: this.state.width,
        height: this.state.height,
        marginBottom: 10,
      },
    })

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {this.props.shows.map((show, index) => (
          <React.Fragment key={show.id}>
            <ArtistShow show={show} styles={showStyles} key={show.id} />
            {isPad()
              ? // show spacers on iPad only between columns
                (index + 1) % this.numberOfColumns() !== 0 && <View style={{ width: 20, height: 20 }} />
              : // show spacers between all elements on phone
                index !== this.props.shows.length - 1 && <View style={{ width: 20, height: 20 }} />}
          </React.Fragment>
        ))}
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
})

export default createFragmentContainer(ShowsList, {
  shows: graphql`
    fragment VariableSizeShowsList_shows on Show @relay(plural: true) {
      id
      ...ArtistShow_show
    }
  `,
})
