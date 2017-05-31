import * as PropTypes from "prop-types"
import * as React from "react"
import ArtworksGrid from "../artwork_grids/relay_connections/gene_artworks_grid"

class Artworks extends React.Component<any, any> {
  static propTypes: Object = {
    gene: PropTypes.shape({
      id: PropTypes.string,
    }),
    medium: PropTypes.string,
    queryState: PropTypes.object,
    queryForPage: PropTypes.func,
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
