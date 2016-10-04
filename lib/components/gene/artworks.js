/* @flow */
'use strict'

import React from 'react'

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
      <ArtworksGrid
        artworks={[]}
        queryForState={this.stateQuery}
        queryForPage={this.resolveQuery}
        queryArtworksKeypath="filter_artworks.hits" />
      )
  }

  stateQuery = () => { }

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

export default Artworks
