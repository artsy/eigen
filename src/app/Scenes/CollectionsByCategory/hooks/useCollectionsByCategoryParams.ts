import { RouteProp, useRoute } from "@react-navigation/native"

export type CollectionsByCategoriesRouteProp = RouteProp<
  {
    collections: {
      slug: string
      title: string
    }
  },
  "collections"
>

export const useCollectionsByCategoryParams = () => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()

  return { slug: params.slug, title: params.title }
}
