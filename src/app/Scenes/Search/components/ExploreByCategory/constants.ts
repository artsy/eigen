export interface MarketingCollectionCategory {
  category: string
  title: string
  imageUrl: string
}

export const MARKETING_COLLECTION_CATEGORIES: MarketingCollectionCategory[] = [
  {
    category: "Medium",
    title: "Medium",
    imageUrl: "https://files.artsy.net/images/collections-mediums-category.jpeg",
  },
  {
    category: "Movement",
    title: "Movement",
    imageUrl: "https://files.artsy.net/images/collections-movement-category.jpeg",
  },
  {
    category: "Collect by Size",
    title: "Size",
    imageUrl: "https://files.artsy.net/images/collections-size-category.jpeg",
  },
  {
    category: "Collect by Color",
    title: "Color",
    imageUrl: "https://files.artsy.net/images/collections-color-category.png",
  },
  {
    category: "Collect by Price",
    title: "Price",
    imageUrl: "https://files.artsy.net/images/collections-price-category.jpeg",
  },
  {
    category: "Gallery",
    title: "Gallery",
    imageUrl: "https://files.artsy.net/images/collections-gallery-category.jpeg",
  },
]

export const getTitleForCategory = (category: string) => {
  return MARKETING_COLLECTION_CATEGORIES.find((c) => c.category === category)?.title || ""
}
