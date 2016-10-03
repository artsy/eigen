/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import Separator from '../../separator'
import SerifText from '../../text/serif'
import ArtworksGrid from '../../artwork_grids/infinite_scroll_grid'

import colors from '../../../../data/colors'

const PageSize = 10

class Artworks extends React.Component {
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
      return this.renderSection('Works',
                                other_count,
                                this.props.artist.not_for_sale_artworks,
                                () => { return ({ availability: 'IS_NOT_FOR_SALE'}) },
                                this.resolveQuery,
                                 null)
    } else {
      const otherWorks = []
      const showOtherWorks = (other_count > 0) && (for_sale_count < 10 || this.state.completedForSaleWorks)
      if (showOtherWorks) {
        otherWorks.push(<Separator style={styles.sectionSeparator} key="separator" />)
        otherWorks.push(this.renderSection('Other Works',
                        other_count,
                        this.props.artist.not_for_sale_artworks,
                        () => { return ({ availability: 'IS_NOT_FOR_SALE'}) },
                        this.resolveQuery,
                        null))
      }
      return (
        <View style={styles.section}>
          {this.renderSection('Works for Sale',
                              for_sale_count,
                              this.props.artist.for_sale_artworks,
                              () => { return ({ availability: 'IS_FOR_SALE'}) },
                              this.resolveQuery,
                              () => { this.setState({ completedForSaleWorks: true }) }
          )}
          {otherWorks}
        </View>
      )
    }
  }

  renderSection(title: string, count: number, artworks: any[], stateQuery: any, pageQuery: any, onComplete: any){
    return (
      <View key={title}>
        <SerifText style={styles.heading}>
          <SerifText style={styles.text}>{title}</SerifText> <SerifText style={[styles.text, styles.count]}>({count})</SerifText>
        </SerifText>
        <ArtworksGrid artworks={artworks} queryForState={stateQuery} queryForPage={pageQuery} onComplete={onComplete} queryArtworksKeypath="artist" />
      </View>
    )
  }

  resolveQuery = (component: ArtworksGrid, page: number, state: any) : string => {
    // The page + 1 is to take into account the fact that we _start_ with results already
    return Artworks.artworksQuery(this.props.relay.route.params.artistID, state.availability, component.state.page + 1)
  }

  // While we are not paginating with Relay, we make individual queires

  static artworksQuery = (artistID, filter, page) => {
    return `
    query {
      artist(id: "${artistID}") {
        artworks(sort: partner_updated_at_desc, filter: ${filter} size: ${PageSize}, page: ${page}) {
          title
          date
          sale_message
          image {
            url(version: "large")
            aspect_ratio
          }
          artist {
            name
          }
          partner {
            name
          }
          href
        }
      }
    }
  `
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
        for_sale_artworks: artworks(sort: partner_updated_at_desc, filter: IS_FOR_SALE, size: 10) {
          ${ArtworksGrid.getFragment('artworks')}
        }
        not_for_sale_artworks: artworks(sort: partner_updated_at_desc, filter: IS_NOT_FOR_SALE, size: 10) {
          ${ArtworksGrid.getFragment('artworks')}
        }
      }
    `,
  }
})
