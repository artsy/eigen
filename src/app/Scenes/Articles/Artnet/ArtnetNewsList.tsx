import { Flex, Spacer, Text, Screen } from "@artsy/palette-mobile"
import {
  CardWithMetaData,
  CardWithMetaDataListItem,
  useNumColumns,
} from "app/Components/Cards/CardWithMetaData"
import { useArtnetNews } from "app/Scenes/Articles/Artnet/useArtnetNews"
import { RefreshControl } from "react-native"

// POC: hardcoded Artnet artist entity key until we map Artsy artists -> Artnet
// entity keys (e.g. from a followed artist or the artist currently in view).
const POC_ARTIST_KEYS = ["Artist_17524"]

export const ArtnetNewsList: React.FC = () => {
  const numColumns = useNumColumns()
  const { articles, loading, error, refetch } = useArtnetNews(POC_ARTIST_KEYS)

  if (error) {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center" px={4}>
        <Text variant="sm-display" textAlign="center">
          Couldn't load Artnet news
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
      keyExtractor={(item) => `${item.id}-${numColumns}`}
      renderItem={({ item, index }) => {
        return (
          <CardWithMetaDataListItem index={index}>
            <CardWithMetaData
              isFluid
              href={item.url}
              imageURL={item.featuredImage?.[0]?.url}
              title={item.title}
              subtitle={item.author}
              tag={item.categoryName}
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
              No Artnet news yet
            </Text>
          </Flex>
        )
      }
    />
  )
}
