import { CuratedCollections_collections$key } from "__generated__/CuratedCollections_collections.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { Flex, Join, Spacer, Text, Touchable } from "palette"
import { graphql, useFragment } from "react-relay"
import { IMAGE_SIZE, SearchResultImage } from "./components/SearchResultImage"

interface CuratedCollectionsProps {
  collections: CuratedCollections_collections$key
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ collections }) => {
  const data = useFragment(CuratedCollectionsFragment, collections)

  const onPress = (slug: string) => {
    navigate(`/collection/${slug}`)
  }

  return (
    <>
      <SectionTitle title="Artsy Curated Collections" />

      <Join separator={<Spacer mb={2} />}>
        {data.collections?.map((collection: any) => (
          <Touchable key={collection.internalID} onPress={() => onPress(collection.slug)}>
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

const CuratedCollectionsFragment = graphql`
  fragment CuratedCollections_collections on Query {
    collections: marketingCollections(
      slugs: [
        "trending-this-week"
        "artists-on-the-rise"
        "trove-editors-picks"
        "painting"
        "photography"
      ]
    ) {
      internalID
      slug
      title
      thumbnail
    }
  }
`
