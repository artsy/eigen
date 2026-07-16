import { FilterIcon } from "@artsy/icons/native"
import { bullet, Flex, Spacer, Text, Screen, TouchableHighlightColor } from "@artsy/palette-mobile"
import {
  CardWithMetaData,
  CardWithMetaDataListItem,
  useNumColumns,
} from "app/Components/Cards/CardWithMetaData"
import { ArtnetEditorialFilterModal } from "app/Scenes/Articles/Artnet/ArtnetEditorialFilterModal"
import { ArtnetPremiumBadge } from "app/Scenes/Articles/Artnet/ArtnetPremiumBadge"
import { ArtnetSearchInput } from "app/Scenes/Articles/Artnet/ArtnetSearchInput"
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

  const [searchText, setSearchText] = useState(filters.search ?? "")

  const { articles, loading, error, hasNextPage, loadMore, refetch } =
    useArtnetEditorialFeed(filters)

  const activeCount = countActiveArtnetFilters(filters)

  const commitSearch = (text: string) => {
    setFilters((prev) => ({ ...prev, search: text.trim() || undefined }))
  }

  return (
    <Flex flex={1}>
      <Flex mx={2} mt={1} mb={2} flexDirection="row" alignItems="center">
        <Flex flex={1}>
          <ArtnetSearchInput
            placeholder="Search articles"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => commitSearch(searchText)}
            onClear={() => {
              setSearchText("")
              commitSearch("")
            }}
          />
        </Flex>
        <Spacer x={2} />
        <TouchableHighlightColor
          haptic
          onPress={() => setFilterModalVisible(true)}
          testID="artnet-editorial-filter-button"
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <FilterIcon fill={color} width="20px" height="20px" />
              <Text variant="xs" numberOfLines={1} color={color} ml={0.5}>
                Sort & Filter
              </Text>
              {activeCount > 0 && (
                <Text variant="xs" color="blue100">
                  {` ${bullet} ${activeCount}`}
                </Text>
              )}
            </Flex>
          )}
        />
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
                <Flex>
                  {!!item.isPremium && (
                    <Flex position="absolute" top={0} left={0} m={1} zIndex={1}>
                      <ArtnetPremiumBadge />
                    </Flex>
                  )}
                  <CardWithMetaData
                    isFluid
                    href="/artnet-article"
                    navigationProps={{ uri: item.uri }}
                    imageURL={item.featuredImage?.node?.sourceUrl}
                    title={item.title}
                    subtitle={item.coAuthors?.[0]?.name}
                    tag={item.categories?.nodes?.[0]?.name}
                  />
                </Flex>
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
