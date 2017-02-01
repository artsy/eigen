import * as Relay from 'react-relay'
import * as React from 'react'
import { View, StyleSheet, ViewProperties } from 'react-native'

import Separator from '../../separator'
import SerifText from '../../text/serif'
import ArtworksGrid from '../../artwork_grids/infinite_scroll_grid'

import colors from '../../../../data/colors'

const PageSize = 10

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

class Artworks extends React.Component<Props, {}> {
  state: {
    completedForSaleWorks: boolean
  }

  constructor(props) {
    super(props)
    this.state = { completedForSaleWorks: false }
  }

  render() {
    const for_sale_count = this.props.artist.counts.for_sale_artworks
    const other_count = this.props.artist.counts.artworks - for_sale_count
    if (for_sale_count === 0) {
      return this.renderSection({
        title: 'Works',
        count: other_count,
        filter: 'IS_NOT_FOR_SALE',
        onComplete: null
      })
    } else {
      let otherWorks : any[] = []
      const showOtherWorks = (other_count > 0) && (for_sale_count < 10 || this.state.completedForSaleWorks)
      if (showOtherWorks) {
        otherWorks.push(<Separator style={styles.sectionSeparator} key="separator" />)
        otherWorks.push(
          this.renderSection({
            title: 'Other Works',
            count: other_count,
            filter: 'IS_NOT_FOR_SALE',
            onComplete: null
          })
        )
      }
      return (
        <View style={styles.section}>
          {this.renderSection({
            title: 'Works for Sale',
            count: for_sale_count,
            filter: 'IS_FOR_SALE',
            onComplete: () => {
              this.setState({ completedForSaleWorks: true })
            }
          })}
          {otherWorks}
        </View>
      )
    }
  }

  renderSection({ title, count, filter, onComplete }){
    return (
      <View key={title}>
        <SerifText style={styles.heading}>
          <SerifText style={styles.text}>{title}</SerifText> <SerifText style={[styles.text, styles.count]}>({count})</SerifText>
        </SerifText>
        <ArtworksGrid
          artist={this.props.artist}
          filter={filter}
          onComplete={onComplete}
          queryKey="artist"
        />
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
    color: colors['gray-semibold'],
  },
  section: {
    marginBottom: 40,
  },
  sectionSeparator: {
    marginTop: 40, // FIXME: This is because the above `section.marginBottom` didn’t work before the separator.
    marginBottom: 20,
  }
})

export default Relay.createContainer(Artworks, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        counts {
          artworks
          for_sale_artworks
        }
        ${ArtworksGrid.getFragment('artist', { filter: 'IS_FOR_SALE' })}
        ${ArtworksGrid.getFragment('artist', { filter: 'IS_NOT_FOR_SALE' })}
      }
    `,
  }
})

interface IRelayProps {
  artist: {
    counts: {
      artworks: boolean | number | string | null,
      for_sale_artworks: boolean | number | string | null,
    } | null,
    for_sale_artworks: Array<boolean | number | string | null> | null,
    not_for_sale_artworks: Array<boolean | number | string | null> | null,
  },
}
