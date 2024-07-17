import { Flex, Screen, Spacer } from "@artsy/palette-mobile"
import { PartnerArtistsListPaginatedQuery } from "__generated__/PartnerArtistsListPaginatedQuery.graphql"
import { PartnerArtistsListPaginated_partner$key } from "__generated__/PartnerArtistsListPaginated_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { ActivityIndicator } from "react-native"
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

  const artists = extractNodes(data.artistsConnection)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(20)
  }

  return (
    <Screen.FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return <ArtistListItem artist={item} />
      }}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={1}
      ListFooterComponent={() => (
        <Flex
          alignItems="center"
          justifyContent="center"
          p={4}
          pb={6}
          style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}
        >
          <ActivityIndicator />
        </Flex>
      )}
    />
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
