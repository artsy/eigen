import { Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { MarketingCollectionHeaderFragment_marketingCollection$key } from "__generated__/MarketingCollectionHeaderFragment_marketingCollection.graphql"
import { OnboardingMarketingCollectionSlug } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingMarketingCollection"
import { graphql, useFragment } from "react-relay"

interface MarketingCollectionHeaderProps {
  collectionSlug: OnboardingMarketingCollectionSlug
  description: string
  marketingCollection: MarketingCollectionHeaderFragment_marketingCollection$key
}

const SAVE_INSTRUCTIONS = "Love an artwork? Tap the heart to save it."

export const MarketingCollectionHeader: React.FC<MarketingCollectionHeaderProps> = ({
  marketingCollection,
  description,
}) => {
  const collection = useFragment(marketingCollectionHeaderFragment, marketingCollection)

  return (
    <Flex mx={-2}>
      <Flex mx={2} mb={2}>
        <Text variant="xl" color="mono100">
          {collection.title}
        </Text>

        <Spacer y={2} />

        <Text variant="sm-display" color="mono100">
          {description}
        </Text>

        <Spacer y={1} />

        <Text variant="sm" color="mono100">
          {SAVE_INSTRUCTIONS}
        </Text>
      </Flex>

      <Separator />
    </Flex>
  )
}

const marketingCollectionHeaderFragment = graphql`
  fragment MarketingCollectionHeaderFragment_marketingCollection on MarketingCollection {
    title
  }
`
