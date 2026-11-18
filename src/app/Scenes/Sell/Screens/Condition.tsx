import { Flex, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ConditionQuery } from "__generated__/ConditionQuery.graphql"
import { SellConditionSection } from "app/Scenes/Sell/Components/SellConditionSection"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { SellConditionStore } from "app/Scenes/Sell/State/SellConditionStore"
import { ActiveSellWork, SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { useConfirmLeavingConditionStep } from "app/Scenes/Sell/hooks/useConfirmLeavingConditionStep"
import { ResaleSubmissionWithChannel } from "app/Scenes/Sell/utils/resaleSubmission"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const Condition: React.FC = () => {
  const activeWork = SellFlowStore.useStoreState((state) => state.activeWork)

  if (!activeWork) {
    return null
  }

  return (
    <SellConditionStore.Provider>
      <ConditionContent {...activeWork} />
    </SellConditionStore.Provider>
  )
}

const ConditionContent: React.FC<ActiveSellWork> = withSuspense({
  Component: ({ artworkID, resaleSubmission }) => {
    const navigation = useNavigation<SellNavigationProp>()
    const data = useLazyLoadQuery<ConditionQuery>(conditionQuery, { artworkID })
    const artwork = data.artwork

    if (!artwork) {
      return <ConditionError />
    }

    return (
      <ConditionForm
        artwork={artwork}
        resaleSubmission={resaleSubmission}
        onContinue={() => navigation.navigate("LocationAndContact")}
      />
    )
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: () => <ConditionError />,
})

const ConditionForm: React.FC<{
  artwork: NonNullable<ConditionQuery["response"]["artwork"]>
  resaleSubmission: ResaleSubmissionWithChannel
  onContinue: () => void
}> = ({ artwork, resaleSubmission, onContinue }) => {
  const { rating, askingPrice } = SellConditionStore.useStoreState((state) => state)
  useConfirmLeavingConditionStep()

  const channelKind = resaleSubmission.channel
  const isMarketplace = channelKind === "MARKETPLACE"
  const canContinue = !!rating && (!isMarketplace || !!askingPrice)

  return (
    <SellFormLayout
      buttonLabel={isMarketplace ? "Confirm Listing Price" : "Continue"}
      buttonDisabled={!canContinue}
      onButtonPress={onContinue}
    >
      <SellStepIntro stepName="Condition" channelKind={channelKind} px={2} />

      <Flex px={2} pb={4}>
        <SellWorkCard artwork={artwork} resaleSubmission={resaleSubmission} />
      </Flex>

      <SellConditionSection />

      {!!isMarketplace && (
        <Flex px={2} pt={4}>
          <SellPriceSection artistNames={artwork.artistNames} />
        </Flex>
      )}
    </SellFormLayout>
  )
}

const ConditionError: React.FC = () => (
  <Flex px={2} pt={2}>
    <Text variant="sm" color="mono60">
      We couldn’t load this work.
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
