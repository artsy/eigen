import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { Flex, Join, Spacer, Text, Touchable } from "palette"
import { IMAGE_SIZE, SearchResultImage } from "./components/SearchResultImage"

interface CuratedCollectionsProps {
  collections: any
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ collections }) => {
  const onPress = (collection: any) => {
    navigate(`/collection/${collection.slug}`)
  }

  return (
    <>
      <SectionTitle title="Artsy Curated Collections" />

      <Join separator={<Spacer mb={2} />}>
        {collections.map((collection: any) => (
          <Touchable key={collection.internalID} onPress={() => onPress(collection)}>
            <Flex
              key={collection.internalID}
              height={IMAGE_SIZE}
              flexDirection="row"
              alignItems="center"
            >
              <SearchResultImage imageURL={collection.thumbnail} resultType="Collection" />

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
        ))}
      </Join>
    </>
  )
}
