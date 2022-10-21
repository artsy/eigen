import { MarketingCollectionHeaderFragment_marketingCollection$key } from "__generated__/MarketingCollectionHeaderFragment_marketingCollection.graphql"
import { Flex, Spacer, Text } from "palette"
import { ImageBackground, ImageSourcePropType } from "react-native"
import { graphql, useFragment } from "react-relay"
import { OnboardingMarketingCollectionSlug } from "../OnboardingMarketingCollection"

interface MarketingCollectionHeaderProps {
  collectionSlug: OnboardingMarketingCollectionSlug
  description: string
  marketingCollection: MarketingCollectionHeaderFragment_marketingCollection$key
}

export const images: Record<OnboardingMarketingCollectionSlug, ImageSourcePropType> = {
  "artists-on-the-rise": require("images/CohnMakeAMountain.webp"),
  "trove-editors-picks": require("images/HirstTheWonder.webp"),
  "top-auction-lots": require("images/HirstTheWonder.webp"),
}

const SAVE_INSTRUCTIONS = "Love an artwork? Tap twice to save it."

export const MarketingCollectionHeader: React.FC<MarketingCollectionHeaderProps> = ({
  collectionSlug,
  marketingCollection,
  description,
}) => {
  const collection = useFragment(marketingCollectionHeaderFragment, marketingCollection)

  return (
    <ImageBackground style={{ height: 250 }} resizeMode="cover" source={images[collectionSlug]}>
      <Flex pt={6} px={2}>
        <Text variant="xl" color="white100">
          {collection.title}
        </Text>
        <Spacer mt={2} />
        <Text variant="sm" color="white100">
          {description}
        </Text>
        <Spacer mt={2} />
        <Text variant="sm" color="white100">
          {SAVE_INSTRUCTIONS}
        </Text>
      </Flex>
    </ImageBackground>
  )
}

const marketingCollectionHeaderFragment = graphql`
  fragment MarketingCollectionHeaderFragment_marketingCollection on MarketingCollection {
    title
  }
`
