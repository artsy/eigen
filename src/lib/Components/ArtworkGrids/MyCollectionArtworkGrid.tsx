import { MyCollectionArtworkGrid_artworks } from "__generated__/MyCollectionArtworkGrid_artworks.graphql"
import Spinner from "lib/Components/Spinner"
import { MyCollectionArtworkListItemFragmentContainer } from "lib/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkListItem"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import { useState } from "react"
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

type Artwork = MyCollectionArtworkGrid_artworks extends ReadonlyArray<infer MyCollectionArtwork>
  ? MyCollectionArtwork
  : never

interface Props {
  artworks: MyCollectionArtworkGrid_artworks
  sectionMargin?: number
  itemMargin?: number
  isLoading?: boolean
  // Give explicit width to avoid resizing after mount
  width?: number
}

interface LayoutState {
  width?: number
  sectionDimension: number
  sectionCount: number
}

export const MyCollectionArtworkGrid: React.FC<Props> = ({
  artworks,
  width,
  sectionMargin = 20,
  itemMargin = 20,
  isLoading,
}) => {
  const [layoutState, setLayoutState] = useState<LayoutState>({
    width,
    sectionDimension: 0,
    sectionCount: 0,
  })

  const screen = useScreenDimensions()

  const getLayoutState = (lWidth: number): LayoutState => {
    const isPadHorizontal = isPad() && screen.width > screen.height

    const sectionCount = isPad() ? (isPadHorizontal ? 4 : 3) : 2
    const sectionMargins = sectionMargin ?? 0 * (sectionCount - 1)
    const sectionDimension = (lWidth - sectionMargins) / sectionCount

    return {
      width: lWidth,
      sectionCount,
      sectionDimension,
    }
  }

  const onLayout = (event: LayoutChangeEvent) => {
    if (width) {
      // noop because we were given an explicit width
      return
    }
    const layout = event.nativeEvent.layout
    if (layout.width !== layoutState.width) {
      // this means we've rotated or are on our initial load
      setLayoutState(getLayoutState(layout.width))
    }
  }

  const buildSectionedArtworks = () => {
    const sectionedArtworks: Artwork[][] = []
    const sectionRatioSums: number[] = []
    for (let i = 0; i < layoutState.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }

    artworks.forEach((artwork) => {
      if (artwork.image) {
        let lowestRatioSum = Number.MAX_VALUE
        let sectionIndex: number | null = null

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

  const renderSections = () => {
    const spacerStyle = {
      height: itemMargin,
    }
    const sectionedArtworks = buildSectionedArtworks()
    const sections = []

    for (let column = 0; column < layoutState.sectionCount; column++) {
      const artworkComponents = []
      const theArtworks = sectionedArtworks[column]
      for (let row = 0; row < theArtworks.length; row++) {
        const artwork = theArtworks[row]
        artworkComponents.push(
          <MyCollectionArtworkListItemFragmentContainer artwork={artwork} key={artwork.id + column + row} />
        )
        if (row < theArtworks.length - 1) {
          artworkComponents.push(<View style={spacerStyle} key={"spacer-" + row} accessibilityLabel="Spacer View" />)
        }
      }

      const sectionSpecificStyle = {
        width: layoutState.sectionDimension,
        marginRight: column === layoutState.sectionCount - 1 ? 0 : sectionMargin,
      }
      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={column} accessibilityLabel={"Section " + column}>
          {artworkComponents}
        </View>
      )
    }
    return sections
  }

  const myCollectionArtworks = layoutState.sectionDimension ? renderSections() : null

  return (
    <Theme>
      <View onLayout={onLayout}>
        <View style={styles.container} accessibilityLabel="Artworks Content View">
          {myCollectionArtworks}
        </View>
        {isLoading ? <Spinner style={styles.spinner} /> : null}
      </View>
    </Theme>
  )
}

interface Styles {
  container: ViewStyle
  section: ViewStyle
  spinner: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "row",
  },
  section: {
    flexDirection: "column",
  },
  spinner: {
    marginTop: 20,
  },
})

const MyCollectionGrid = createFragmentContainer(MyCollectionArtworkGrid, {
  artworks: graphql`
    fragment MyCollectionArtworkGrid_artworks on Artwork @relay(plural: true) {
      id
      image {
        aspect_ratio: aspectRatio
      }
      ...MyCollectionArtworkListItem_artwork
    }
  `,
})

export default MyCollectionGrid
