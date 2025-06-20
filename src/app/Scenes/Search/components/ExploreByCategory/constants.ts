export interface MarketingCollectionCategory {
  id: string
  title: string
  imageUrl: string
  sortedCollectionSlugs: string[]
}

export const MARKETING_COLLECTION_CATEGORIES: Record<string, MarketingCollectionCategory> = {
  Medium: {
    id: "Medium",
    title: "Medium",
    imageUrl: "https://files.artsy.net/images/collections-mediums-category.jpeg",
    sortedCollectionSlugs: [
      "painting",
      "sculpture",
      "works-on-paper",
      "prints",
      "drawing",
      "textile-art",
      "ceramics",
      "mixed-media",
      "design",
      "photography",
    ],
  },
  Movement: {
    id: "Movement",
    title: "Movement",
    imageUrl: "https://files.artsy.net/images/collections-movement-category.jpeg",
    sortedCollectionSlugs: [
      "contemporary-art",
      "abstract-art",
      "impressionist-and-modern",
      "emerging-art",
      "minimalist-art",
      "street-art",
      "pop-art",
      "post-war",
      "20th-century-art",
      "pre-columbian-art",
    ],
  },
  "Collect by Size": {
    id: "Collect by Size",
    title: "Size",
    imageUrl: "https://files.artsy.net/images/collections-size-category.jpeg",
    sortedCollectionSlugs: ["art-for-small-spaces", "art-for-large-spaces", "tabletop-sculpture"],
  },
  "Collect by Color": {
    id: "Collect by Color",
    title: "Color",
    imageUrl: "https://files.artsy.net/images/collections-color-category.png",
    sortedCollectionSlugs: [
      "black-and-white-artworks",
      "warm-toned-artworks",
      "cool-toned-artworks",
      "blue-artworks",
      "red-artworks",
      "neutral-artworks",
      "green-artworks",
      "yellow-artworks",
      "orange-artworks",
    ],
  },
  "Collect by Price": {
    id: "Collect by Price",
    title: "Price",
    imageUrl: "https://files.artsy.net/images/collections-price-category.jpeg",
    sortedCollectionSlugs: [
      "art-under-500-dollars",
      "art-under-1000-dollars",
      "art-under-2500-dollars",
      "art-under-5000-dollars",
      "art-under-10000-dollars",
      "art-under-25000-dollars",
      "art-under-50000-dollars",
    ],
  },
  Gallery: {
    id: "Gallery",
    title: "Gallery",
    imageUrl: "https://files.artsy.net/images/collections-gallery-category.jpeg",
    sortedCollectionSlugs: [
      "new-from-tastemaking-galleries",
      "new-from-nonprofits-acaf27cc-2d39-4ed3-93dd-d7099e183691",
      "new-from-small-galleries",
      "new-from-leading-galleries",
      "new-to-artsy",
    ],
  },
}

export const ORDERED_CATEGORY_KEYS = Object.keys(
  MARKETING_COLLECTION_CATEGORIES
) as (keyof typeof MARKETING_COLLECTION_CATEGORIES)[]
