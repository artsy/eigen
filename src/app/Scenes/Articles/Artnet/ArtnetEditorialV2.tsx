import { Button, Flex, Spacer, Text, Screen } from "@artsy/palette-mobile"
import {
  CardWithMetaData,
  CardWithMetaDataListItem,
  useNumColumns,
} from "app/Components/Cards/CardWithMetaData"
import { ArtnetEditorialFilterModal } from "app/Scenes/Articles/Artnet/ArtnetEditorialFilterModal"
import {
  ArtnetEditorialFilters,
  countActiveArtnetFilters,
} from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useArtnetEditorialFeed } from "app/Scenes/Articles/Artnet/useArtnetEditorialFeed"
import { useState } from "react"
import { RefreshControl } from "react-native"

const INITIAL_FILTERS: ArtnetEditorialFilters = { sort: "DESC" }

export const ArtnetEditorialV2: React.FC = () => {
  const numColumns = useNumColumns()
  const [filters, setFilters] = useState<ArtnetEditorialFilters>(INITIAL_FILTERS)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const { articles, loading, error, hasNextPage, loadMore, refetch } =
    useArtnetEditorialFeed(filters)

  const activeCount = countActiveArtnetFilters(filters)

  return (
    <Flex flex={1}>
      <Flex mx={2} mb={1} flexDirection="row" justifyContent="flex-end">
        <Button
          variant="outline"
          size="small"
          onPress={() => setFilterModalVisible(true)}
          testID="artnet-editorial-filter-button"
        >
          {activeCount > 0 ? `Filter (${activeCount})` : "Filter"}
        </Button>
      </Flex>

      {error ? (
        <Flex flex={1} alignItems="center" justifyContent="center" px={4}>
          <Text variant="sm-display" textAlign="center">
            Couldn't load Artnet Editorial
          </Text>
          <Spacer y={1} />
          <Text variant="xs" color="mono60" textAlign="center">
            {error.message}
          </Text>
        </Flex>
      ) : (
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
          ListEmptyComponent={
            loading ? null : (
              <Flex alignItems="center" justifyContent="center" p={4}>
                <Text variant="sm" color="mono60">
                  No Artnet Editorial articles match these filters
                </Text>
              </Flex>
            )
          }
        />
      )}

      <ArtnetEditorialFilterModal
        visible={filterModalVisible}
        currentFilters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilters}
      />
    </Flex>
  )
}
