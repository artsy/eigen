import { Flex, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { PartnerOverviewListPaginatedQuery } from "__generated__/PartnerOverviewListPaginatedQuery.graphql"
import { PartnerOverviewListPaginated_partner$key } from "__generated__/PartnerOverviewListPaginated_partner.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { PartnerLocationSection } from "app/Scenes/Partner/Components/PartnerLocationSection"
import { extractNodes } from "app/utils/extractNodes"
import { ActivityIndicator } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface PartnerOverviewListProps {
  aboutText?: string | null
  displayArtistsSection?: boolean | null
  partner: PartnerOverviewListPaginated_partner$key
}

export const PartnerOverviewList: React.FC<PartnerOverviewListProps> = ({
  aboutText,
  displayArtistsSection,
  partner,
}) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    PartnerOverviewListPaginatedQuery,
    PartnerOverviewListPaginated_partner$key
  >(PartnerOverviewListPaginatedFragment, partner)

  const artists = extractNodes(data.artistsConnection)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(20)
  }

  // TODO: Should we be using a viewability config here?
  // TODO: fix types in fragment and make display of artists section optional
  return (
    <Tabs.FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => {
        return (
          <>
            <Spacer y={2} />
            {!!aboutText && (
              <>
                <ReadMore content={aboutText} maxChars={300} textVariant="sm" />
              </>
            )}
            <PartnerLocationSection partner={data as any} />
            {!!displayArtistsSection && (
              <>
                <Text variant="sm">Artists ({data.artistsConnection?.totalCount})</Text>
                <Spacer y={2} />
              </>
            )}
          </>
        )
      }}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      renderItem={({ item }) => <ArtistListItem artist={item} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
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

const PartnerOverviewListPaginatedFragment = graphql`
  fragment PartnerOverviewListPaginated_partner on Partner
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" })
  @refetchable(queryName: "PartnerOverviewListPaginatedQuery") {
    cities
    displayArtistsSection
    profile {
      bio
    }
    name
    slug
    cities
    locations: locationsConnection(first: 0) {
      totalCount
    }
    artistsConnection(
      first: $count
      after: $cursor
      displayOnPartnerProfile: true
      representedByOrHasPublishedArtworks: true
    ) @connection(key: "PartnerOverviewListPaginated_artistsConnection") {
      totalCount
      edges {
        node {
          id
          ...ArtistListItem_artist
        }
      }
    }
    ...PartnerLocationSection_partner
  }
`
