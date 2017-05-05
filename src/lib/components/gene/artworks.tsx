import * as React from "react"
import ArtworksGrid from "../artwork_grids/relay_connections/gene_artworks_grid"

class Artworks extends React.Component<any, any> {
  static propTypes: Object = {
    gene: React.PropTypes.shape({
      id: React.PropTypes.string,
    }),
    medium: React.PropTypes.string,
    queryState: React.PropTypes.object,
    queryForPage: React.PropTypes.func,
  }

  render() {
   return (
      <ArtworksGrid
        artworks={[]}
        queryState={this.props.queryState}
        queryForPage={this.props.resolveQuery}
        queryArtworksKeypath="gene.filtered_artworks.hits" />
      )
  }
}

export default Artworks
