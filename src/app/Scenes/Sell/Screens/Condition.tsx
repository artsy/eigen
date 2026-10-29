import { Flex, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ConditionQuery } from "__generated__/ConditionQuery.graphql"
import {
  EMPTY_SELL_CONDITION,
  SellConditionSection,
  SellConditionValue,
} from "app/Scenes/Sell/Components/SellConditionSection"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { SellChannel, getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const Condition: React.FC = () => {
  const artworkID = SellFlowStore.useStoreState((state) => state.activeArtworkID)

  if (!artworkID) {
    return null
  }

  return <ConditionContent artworkID={artworkID} />
}

const ConditionContent: React.FC<{ artworkID: string }> = withSuspense({
  Component: ({ artworkID }) => {
    const navigation = useNavigation<SellNavigationProp>()
    const data = useLazyLoadQuery<ConditionQuery>(conditionQuery, { artworkID })
    const artwork = data.artwork

    if (!artwork) {
      return <ConditionError />
    }

    return (
      <ConditionForm
        artwork={artwork}
        channelKind={getSellChannel(artwork.internalID).kind}
        onContinue={() => navigation.navigate("LocationAndContact")}
      />
    )
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: () => <ConditionError />,
})

const ConditionForm: React.FC<{
  artwork: NonNullable<ConditionQuery["response"]["artwork"]>
  channelKind: SellChannel["kind"]
  onContinue: () => void
}> = ({ artwork, channelKind, onContinue }) => {
  const [condition, setCondition] = useState<SellConditionValue>(EMPTY_SELL_CONDITION)
  const [askingPrice, setAskingPrice] = useState("")

  const isMarketplace = channelKind === "MARKETPLACE"
  const canContinue = !!condition.rating && (!isMarketplace || !!askingPrice)

  return (
    <SellFormLayout
      buttonLabel={isMarketplace ? "Confirm Listing Price" : "Continue"}
      buttonDisabled={!canContinue}
      onButtonPress={onContinue}
    >
      <SellStepIntro stepName="Condition" channelKind={channelKind} px={2} />

      <Flex px={2} pb={4}>
        <SellWorkCard artwork={artwork} />
      </Flex>

      <SellConditionSection value={condition} onChange={setCondition} />

      {!!isMarketplace && (
        <Flex px={2} pt={4}>
          <SellPriceSection
            artistNames={artwork.artistNames}
            askingPrice={askingPrice}
            onAskingPriceChange={setAskingPrice}
            disabled={!condition.rating}
          />
        </Flex>
      )}
    </SellFormLayout>
  )
}

const ConditionError: React.FC = () => (
  <Flex px={2} pt={2}>
    <Text variant="sm" color="mono60">
      We couldn't load this work.
    </Text>
  </Flex>
)

const conditionQuery = graphql`
  query ConditionQuery($artworkID: String!) {
    artwork(id: $artworkID) {
      internalID
      artistNames
      ...SellWorkCard_artwork
    }
  }
`
