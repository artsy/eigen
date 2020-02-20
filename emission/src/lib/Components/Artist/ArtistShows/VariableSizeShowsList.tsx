import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"

import ArtistShow from "./ArtistShow"

import { VariableSizeShowsList_shows } from "__generated__/VariableSizeShowsList_shows.graphql"

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

  imageDimensions(layout) {
    const width = layout.width
    const isPad = width > 700
    const showSize = this.props.showSize

    const marginSpace = 20 * this.numberOfColumns(isPad)
    const imageWidth = isPad ? (width - marginSpace) / this.numberOfColumns(isPad) : width - 20

    const aspectRatio = showSize === "large" ? 1.6 : 1.4
    const imageHeight = Math.floor(imageWidth / aspectRatio)
    return { width: imageWidth, height: imageHeight }
  }

  numberOfColumns = (isPad: boolean) => {
    if (isPad) {
      return this.props.showSize === "large" ? 2 : 3
    }

    return 1
  }

  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    this.setState(this.imageDimensions(layout))
  }

  render() {
    const showSize = this.props.showSize
    const showStyles = StyleSheet.create({
      container: {
        margin: 10,
        marginBottom: showSize === "medium" ? 30 : 10,
        width: this.state.width,
      },
      image: {
        width: this.state.width,
        height: this.state.height,
      },
    })

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {this.props.shows.map(show => this.renderShow(show, showStyles))}
      </View>
    )
  }

  renderShow(show, showStyles) {
    return <ArtistShow show={show} styles={showStyles} key={show.id} />
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
    marginLeft: -10,
    marginRight: -10,
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
