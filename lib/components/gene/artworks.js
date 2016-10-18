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
        queryForState={this.props.stateQuery}
        queryForPage={this.props.resolveQuery}
        queryArtworksKeypath="gene.filtered_artworks.hits" />
      )
  }
}

export default Artworks
