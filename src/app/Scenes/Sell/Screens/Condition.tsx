import { Box, Button, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ConditionQuery } from "__generated__/ConditionQuery.graphql"
import {
  EMPTY_SELL_CONDITION,
  SellConditionSection,
  SellConditionValue,
} from "app/Scenes/Sell/Components/SellConditionSection"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { AUCTION_CONDITION_STEP } from "app/Scenes/Sell/sellSteps"
import { SellChannel, getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { useState } from "react"
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const [stickyFooterHeight, setStickyFooterHeight] = useState(0)
  const keyboard = useReanimatedKeyboardAnimation()

  // Like KeyboardStickyView, but never below its resting place. Gboard's toolbar for hardware
  // keyboards is shorter than the bottom inset and would push the footer under the nav bar.
  const stickyFooterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: Math.min(0, keyboard.height.get() + keyboard.progress.get() * bottom) },
    ],
  }))

  const [condition, setCondition] = useState<SellConditionValue>(EMPTY_SELL_CONDITION)
  const [askingPrice, setAskingPrice] = useState("")

  const isMarketplace = channelKind === "MARKETPLACE"
  const canContinue = !!condition.rating && (!isMarketplace || !!askingPrice)

  return (
    <Flex flex={1} bg="mono0">
      <KeyboardAwareForm
        // The sticky footer covers the bottom of the form, so keep the focused input above it
        bottomOffset={stickyFooterHeight}
        contentContainerStyle={{ paddingBottom: space(2) }}
      >
        {isMarketplace ? (
          <SellStepIntro stepName="Condition" px={2} />
        ) : (
          <SellStepIntro
            stepName="Condition"
            title={AUCTION_CONDITION_STEP.title}
            description={AUCTION_CONDITION_STEP.description}
            px={2}
          />
        )}

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
      </KeyboardAwareForm>

      <Animated.View
        style={stickyFooterStyle}
        onLayout={(event) => setStickyFooterHeight(event.nativeEvent.layout.height)}
      >
        <Box px={2} pt={2} bg="mono0" style={{ paddingBottom: bottom + space(2) }}>
          <Button block haptic variant="fillDark" disabled={!canContinue} onPress={onContinue}>
            {isMarketplace ? "Confirm Listing Price" : "Continue"}
          </Button>
        </Box>
      </Animated.View>
    </Flex>
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
