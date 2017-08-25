import * as React from "react"
import { StyleSheet, View, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ArtistArtworksGrid from "../../ArtworkGrids/RelayConnections/ArtistArtworksGrid"
import Separator from "../../Separator"
import SerifText from "../../Text/Serif"

import colors from "../../../../data/colors"

interface Props extends ViewProperties {
  artist: {
    counts: {
      for_sale_artworks: number
      artworks: number
    }
    not_for_sale_artworks: any[]
    for_sale_artworks: any[]
  }
  relay: any
}

interface State {
  completedForSaleWorks: boolean
}

class Artworks extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      completedForSaleWorks: false,
    }
  }

  render() {
    const forSaleCount = this.props.artist.counts.for_sale_artworks
    const otherCount = this.props.artist.counts.artworks - forSaleCount
    if (forSaleCount === 0) {
      return this.renderSection({
        title: "Works",
        count: otherCount,
        filter: "IS_NOT_FOR_SALE",
        onComplete: null,
      })
    } else {
      const otherWorks: any[] = []
      const showOtherWorks = otherCount > 0 && (forSaleCount < 10 || this.state.completedForSaleWorks)
      if (showOtherWorks) {
        otherWorks.push(<Separator style={styles.sectionSeparator} key="separator" />)
        otherWorks.push(
          this.renderSection({
            title: "Other Works",
            count: otherCount,
            filter: "IS_NOT_FOR_SALE",
            onComplete: null,
          })
        )
      }
      return (
        <View style={styles.section}>
          {this.renderSection({
            title: "Works for Sale",
            count: forSaleCount,
            filter: "IS_FOR_SALE",
            onComplete: () => {
              this.setState({ completedForSaleWorks: true })
            },
          })}
          {otherWorks}
        </View>
      )
    }
  }

  renderSection({ title, count, filter, onComplete }) {
    const countStyles = [styles.text, styles.count]
    return (
      <View key={title}>
        <SerifText style={styles.heading}>
          <SerifText style={styles.text}>{title}</SerifText> <SerifText style={countStyles}>({count})</SerifText>
        </SerifText>
        <ArtistArtworksGrid artist={this.props.artist} filter={filter} onComplete={onComplete} queryKey="artist" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
  count: {
    color: colors["gray-semibold"],
  },
  section: {
    marginBottom: 40,
  },
  sectionSeparator: {
    marginTop: 40, // FIXME: This is because the above `section.marginBottom` didn’t work before the separator.
    marginBottom: 20,
  },
})

// export default Relay.createContainer(Artworks, {
//   fragments: {
//     artist: () => Relay.QL`
//       fragment on Artist {
//         counts {
//           artworks
//           for_sale_artworks
//         }
//         ${ArtworksGrid.getFragment("artist", { filter: ["IS_FOR_SALE"] })}
//         ${ArtworksGrid.getFragment("artist", { filter: ["IS_NOT_FOR_SALE"] })}
//       }
//     `,
//   },
// })

// FIXME: After migrating to modern mode, we need to re-add the second query for not for sale works
export default createFragmentContainer(
  Artworks,
  graphql.experimental`
    fragment Artworks_artist on Artist @argumentDefinitions(
      forSaleArtworksFilter: { type: "[ArtistArtworksFilters]", defaultValue: [IS_FOR_SALE] }
    ) {
      counts {
        artworks
        for_sale_artworks
      }
      ...ArtistArtworksGrid_artist @arguments(filter: $forSaleArtworksFilter)
    }
  `
)

interface RelayProps {
  artist: {
    counts: {
      artworks: boolean | number | string | null
      for_sale_artworks: boolean | number | string | null
    } | null
    for_sale_artworks: Array<boolean | number | string | null> | null
    not_for_sale_artworks: Array<boolean | number | string | null> | null
  }
}
