import { CuratedCollectionItem_collection$key } from "__generated__/CuratedCollectionItem_collection.graphql"
import { navigate } from "app/navigation/navigate"
import { Flex, Spacer, Text, Touchable } from "palette"
import { graphql, useFragment } from "react-relay"
import { IMAGE_SIZE, SearchResultImage } from "./components/SearchResultImage"

interface CuratedCollectionItemProps {
  collection: CuratedCollectionItem_collection$key
}

export const CuratedCollectionItem: React.FC<CuratedCollectionItemProps> = ({ collection }) => {
  const item = useFragment(CuratedCollectionItemFragment, collection)
  const thumbnail = item.thumbnailImage?.resized?.url || null

  const onPress = (slug: string) => {
    navigate(`/collection/${slug}`)
  }

  return (
    <Touchable key={item.internalID} onPress={() => onPress(item.slug)}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage imageURL={thumbnail} resultType="Collection" />

        <Spacer ml={1} />

        <Flex flex={1}>
          <Text variant="xs" numberOfLines={1}>
            {item.title}
          </Text>

          <Text variant="xs" color="black60">
            Collection
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const CuratedCollectionItemFragment = graphql`
  fragment CuratedCollectionItem_collection on MarketingCollection {
    internalID
    slug
    title
    thumbnailImage {
      resized(width: 40) {
        url
      }
    }
  }
`
