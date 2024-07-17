import { Text } from "@artsy/palette-mobile"
import { PartnerArtistsListPaginatedQuery } from "__generated__/PartnerArtistsListPaginatedQuery.graphql"
import { PartnerArtistsListPaginated_partner$key } from "__generated__/PartnerArtistsListPaginated_partner.graphql"
import { graphql, usePaginationFragment } from "react-relay"

interface PartnerArtistsListPaginatedProps {
  partner: PartnerArtistsListPaginated_partner$key
}

export const PartnerArtistsListPaginated: React.FC<PartnerArtistsListPaginatedProps> = ({
  partner,
}) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    PartnerArtistsListPaginatedQuery,
    PartnerArtistsListPaginated_partner$key
  >(PartnerArtistsListPaginatedFragment, partner)

  return (
    <>
      <Text variant="sm-display">Artists should be displayed here</Text>
    </>
  )
}

const PartnerArtistsListPaginatedFragment = graphql`
  fragment PartnerArtistsListPaginated_partner on Partner
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" })
  @refetchable(queryName: "PartnerArtistsListPaginatedQuery") {
    artistsConnection(
      first: $count
      after: $cursor
      displayOnPartnerProfile: true
      representedByOrHasPublishedArtworks: true
    ) @connection(key: "PartnerArtistsListPaginated_artistsConnection") {
      totalCount
      edges {
        node {
          id
          ...ArtistListItem_artist
        }
      }
    }
  }
`
