import { Flex, Spacer, Text, Screen } from "@artsy/palette-mobile"
import {
  CardWithMetaData,
  CardWithMetaDataListItem,
  useNumColumns,
} from "app/Components/Cards/CardWithMetaData"
import { ArtnetEditorialFilters } from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useArtnetEditorialFeed } from "app/Scenes/Articles/Artnet/useArtnetEditorialFeed"
import { RefreshControl } from "react-native"

// Slice 1: no filter UI yet — newest-first feed to validate the v2 gateway
// end-to-end. Filters, article detail, and paywall come in later slices.
const INITIAL_FILTERS: ArtnetEditorialFilters = { sort: "DESC" }

export const ArtnetEditorialV2: React.FC = () => {
  const numColumns = useNumColumns()
  const { articles, loading, error, hasNextPage, loadMore, refetch } =
    useArtnetEditorialFeed(INITIAL_FILTERS)

  if (error) {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center" px={4}>
        <Text variant="sm-display" textAlign="center">
          Couldn't load Artnet Editorial
        </Text>
        <Spacer y={1} />
        <Text variant="xs" color="mono60" textAlign="center">
          {error.message}
        </Text>
      </Flex>
    )
  }

  return (
    <Screen.FlatList
      numColumns={numColumns}
      key={`${numColumns}`}
      data={articles}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      keyExtractor={(item) => `${item.databaseId}-${numColumns}`}
      onEndReachedThreshold={1}
      onEndReached={() => {
        if (hasNextPage) {
          loadMore()
        }
      }}
      renderItem={({ item, index }) => {
        return (
          <CardWithMetaDataListItem index={index}>
            <CardWithMetaData
              isFluid
              href={undefined}
              imageURL={item.featuredImage?.node?.sourceUrl}
              title={item.title}
              subtitle={item.coAuthors?.[0]?.name}
              tag={item.categories?.nodes?.[0]?.name}
            />
          </CardWithMetaDataListItem>
        )
      }}
      ItemSeparatorComponent={() => <Spacer y={4} />}
      style={{ paddingTop: 20 }}
      ListEmptyComponent={
        loading ? null : (
          <Flex alignItems="center" justifyContent="center" p={4}>
            <Text variant="sm" color="mono60">
              No Artnet Editorial articles yet
            </Text>
          </Flex>
        )
      }
    />
  )
}
