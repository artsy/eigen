import { Flex, Text } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { CollectionsByCategoriesRouteProp } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import { MARKETING_COLLECTION_CATEGORIES } from "app/Scenes/Search/components/ExploreByCategory/constants"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FC } from "react"

export const Footer: FC = () => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = decodeURI(params.category)

  const categories = MARKETING_COLLECTION_CATEGORIES.filter((c) => c.category !== category)

  if (categories.length === 0) {
    return null
  }

  return (
    <Flex backgroundColor="mono100" p={2} gap={2}>
      <Text color="mono0">Explore more categories</Text>

      {categories.map((c, index) => (
        <RouterLink
          disablePrefetch
          key={`category_rail_${index}`}
          to={`/collections-by-category/${c.category}`}
        >
          <Text variant="xl" color="mono0">
            {c.title}
          </Text>
        </RouterLink>
      ))}
    </Flex>
  )
}
