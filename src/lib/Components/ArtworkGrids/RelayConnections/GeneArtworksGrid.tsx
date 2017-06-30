import * as Relay from "react-relay"
import Artwork from "../Artwork"
import InfiniteScrollArtworksGrid, { PageSize } from "../InfiniteScrollGrid"

export default Relay.createContainer(InfiniteScrollArtworksGrid, {
  initialVariables: {
    totalSize: PageSize,
    medium: "*",
    priceRange: "*-*",
    sort: "-partner_updated_at",
  },
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        artworks: artworks_connection(sort: $sort,
                                      price_range: $priceRange,
                                      medium: $medium,
                                      first: $totalSize,
                                      for_sale: true) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              __id
              image {
                aspect_ratio
              }
              ${Artwork.getFragment("artwork")}
            }
          }
        }
      }
    `,
  },
})

export interface GeneRelayProps {
  gene: {
    artworks_connection: {
      pageInfo: {
        hasNextPage: boolean
      }
      edges: Array<{
        node: {
          __id: string
          image: {
            aspect_ratio: number | null
          } | null
        } | null
      }>
    } | null
  }
}
