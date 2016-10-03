/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import Separator from '../separator'
import SerifText from '../text/serif'
import ArtworksGrid from '../artwork_grids/infinite_scroll_grid'


class Artworks extends React.Component {
  static propTypes: Object = {
    gene: React.PropTypes.shape({
      id: React.PropTypes.string,
    }),
    medium: React.PropTypes.string,
  }

  render() {
   return (
      <ArtworksGrid artworks={[]} queryForState={this.stateQuery}  queryForPage={this.resolveQuery} queryArtworksKeypath="filter_artworks.hits" />
      )
  }

  stateQuery = () => { {} }

  resolveQuery = (component: ArtworksGrid, page: number, state: any) : string =>
    Artworks.artworksQuery(this.props.gene.id, null, page)

  static artworksQuery = (geneID: string, medium: ?string, page: number) => {
    const mediumParam = medium ? ', medium: ' + medium : ''
    return `
    {
      filter_artworks(gene_id: "${geneID}" ${mediumParam}, page:${page}){
        hits {
          id
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
  section: {
    marginBottom: 40,
  },
  sectionSeparator: {
    marginTop: 40, // FIXME: This is because the above `section.marginBottom` didn’t work before the separator.
    marginBottom: 20,
  }
})

export default Artworks
