import { navigate } from "app/navigation/navigate"
import { Flex, Spacer, Text, Touchable } from "palette"
import { IMAGE_SIZE, SearchResultImage } from "./components/SearchResultImage"

interface CuratedCollectionItemProps {
  collection: any
}

export const CuratedCollectionItem: React.FC<CuratedCollectionItemProps> = ({ collection }) => {
  const onPress = (slug: string) => {
    navigate(`/collection/${slug}`)
  }

  return (
    <Touchable key={collection.internalID} onPress={() => onPress(collection.slug)}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage imageURL={collection.thumbnailImage?.url} resultType="Collection" />

        <Spacer ml={1} />

        <Flex flex={1}>
          <Text variant="xs" numberOfLines={1}>
            {collection.title}
          </Text>

          <Text variant="xs" color="black60">
            Collection
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}
