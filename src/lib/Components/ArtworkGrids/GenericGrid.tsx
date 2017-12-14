import React from "react"
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import Artwork from "./Artwork"

interface Props extends RelayProps {
  sectionDirection: "column" // FIXME: We don’t actually support more options atm
  sectionMargin: number
  itemMargin: number
}

interface State {
  sectionDimension: number
  sectionCount: number
}

class GenericArtworksGrid extends React.Component<Props, State> {
  static defaultProps = {
    sectionDirection: "column",
    sectionMargin: 20,
    itemMargin: 20,
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionDimension: 0,
      sectionCount: 0,
    }

    this.onLayout = this.onLayout.bind(this)
  }

  tappedOnArtwork = (artworkID: string) => {
    const allArtworkIDs = this.props.artworks.map(a => a.id)
    const index = allArtworkIDs.indexOf(artworkID)
    SwitchBoard.presentArtworkSet(this, allArtworkIDs, index)
  }

  layoutState(currentLayout): State {
    const width = currentLayout.width
    const isPad = width > 600
    const isPadHorizontal = width > 900

    const sectionCount = isPad ? (isPadHorizontal ? 4 : 3) : 2
    const sectionMargins = this.props.sectionMargin * (sectionCount - 1)
    const sectionDimension = (currentLayout.width - sectionMargins) / sectionCount

    return {
      sectionCount,
      sectionDimension,
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout
    const newLayoutState = this.layoutState(layout)
    if (layout.width > 0) {
      this.setState(newLayoutState)
    }
  }

  sectionedArtworks() {
    const sectionedArtworks = []
    const sectionRatioSums = []
    for (let i = 0; i < this.state.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }

    this.props.artworks.forEach(artwork => {
      if (artwork.image) {
        let lowestRatioSum = Number.MAX_VALUE
        let sectionIndex: number = null

        for (let j = 0; j < sectionRatioSums.length; j++) {
          const ratioSum = sectionRatioSums[j]
          if (ratioSum < lowestRatioSum) {
            sectionIndex = j
            lowestRatioSum = ratioSum
          }
        }

        if (sectionIndex != null) {
          const section = sectionedArtworks[sectionIndex]
          section.push(artwork)

          // total section aspect ratio
          const aspectRatio = artwork.image.aspect_ratio || 1
          sectionRatioSums[sectionIndex] += 1 / aspectRatio
        }
      }
    })

    return sectionedArtworks
  }

  renderSections() {
    const spacerStyle = {
      height: this.props.itemMargin,
    }
    const sectionedArtworks = this.sectionedArtworks()
    const sections = []
    for (let i = 0; i < this.state.sectionCount; i++) {
      const artworkComponents = []
      const artworks = sectionedArtworks[i]
      for (let j = 0; j < artworks.length; j++) {
        const artwork = artworks[j]
        artworkComponents.push(
          <Artwork artwork={artwork} key={artwork.__id + i + j} onPress={this.tappedOnArtwork.bind(this)} />
        )
        if (j < artworks.length - 1) {
          artworkComponents.push(<View style={spacerStyle} key={"spacer-" + j} accessibilityLabel="Spacer View" />)
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: i === this.state.sectionCount - 1 ? 0 : this.props.sectionMargin,
      }
      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={i} accessibilityLabel={"Section " + i}>
          {artworkComponents}
        </View>
      )
    }
    return sections
  }

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null
    return (
      <View onLayout={this.onLayout}>
        <View style={styles.container} accessibilityLabel="Artworks Content View">
          {artworks}
        </View>
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle
  section: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "row",
  },
  section: {
    flexDirection: "column",
  },
})

const GenericGrid = createFragmentContainer(
  GenericArtworksGrid,
  graphql`
    fragment GenericGrid_artworks on Artwork @relay(plural: true) {
      __id
      id
      image {
        aspect_ratio
      }
      ...Artwork_artwork
    }
  `
)

export default GenericGrid

interface RelayProps {
  artworks: Array<{
    __id: string
    id: string
    image: {
      aspect_ratio: number | null
    } | null
  } | null> | null
}
