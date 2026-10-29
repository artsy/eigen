import { Box, Button, Flex, Input, Text, useSpace } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ConditionQuery } from "__generated__/ConditionQuery.graphql"
import { SellWorkCard_artwork$key } from "__generated__/SellWorkCard_artwork.graphql"
import {
  SellConditionPhoto,
  SellConditionPhotos,
} from "app/Scenes/Sell/Components/SellConditionPhotos"
import {
  SellConditionRating,
  SellConditionRatingPicker,
} from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { AUCTION_CONDITION_STEP } from "app/Scenes/Sell/sellSteps"
import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { useState } from "react"
import { ScrollView } from "react-native"
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

    const continueToShipping = () => navigation.navigate("LocationAndContact")

    if (getSellChannel(artwork.internalID).kind === "MARKETPLACE") {
      return (
        <SellStepLayout buttonLabel="Continue" onButtonPress={continueToShipping}>
          <ScrollView>
            <SellStepIntro stepName="Condition" px={2} />
            <Flex px={2} gap={2}>
              <SellWorkCard artwork={artwork} />
              <Text variant="sm" color="mono60">
                Listing works aren't supported yet.
              </Text>
            </Flex>
          </ScrollView>
        </SellStepLayout>
      )
    }

    return <AuctionConditionForm artwork={artwork} onContinue={continueToShipping} />
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: () => <ConditionError />,
})

const AuctionConditionForm: React.FC<{
  artwork: SellWorkCard_artwork$key
  onContinue: () => void
}> = ({ artwork, onContinue }) => {
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

  const [rating, setRating] = useState<SellConditionRating | null>(null)
  const [photos, setPhotos] = useState<SellConditionPhoto[]>([])
  const [notes, setNotes] = useState("")

  const addPhotos = (newPhotos: SellConditionPhoto[]) => {
    setPhotos((current) => [
      ...current,
      ...newPhotos.filter((photo) => !current.some(({ path }) => path === photo.path)),
    ])
  }

  return (
    <Flex flex={1} bg="mono0">
      <KeyboardAwareForm
        // The sticky footer covers the bottom of the form, so keep the focused input above it
        bottomOffset={stickyFooterHeight}
        contentContainerStyle={{ paddingBottom: space(2) }}
      >
        <SellStepIntro
          stepName="Condition"
          title={AUCTION_CONDITION_STEP.title}
          description={AUCTION_CONDITION_STEP.description}
          px={2}
        />

        <Flex px={2} gap={4} pb={2}>
          <SellWorkCard artwork={artwork} />

          <Flex gap={1}>
            <Text variant="md">Condition</Text>
            <Text variant="sm">How would you describe the work's condition?</Text>
          </Flex>
        </Flex>

        <SellConditionRatingPicker value={rating} onChange={setRating} />

        <Flex px={2} pt={4} gap={4}>
          <Flex gap={1}>
            <Text variant="sm">Add photos of the condition</Text>
            <Text variant="xs" color="mono60">
              Show any wear, damage or restoration so buyers know what to expect.
            </Text>
            <SellConditionPhotos
              photos={photos}
              onAdd={addPhotos}
              onRemove={(path) =>
                setPhotos((current) => current.filter((photo) => photo.path !== path))
              }
            />
          </Flex>

          <Flex gap={1}>
            <Text variant="sm">Anything else we should know?</Text>
            <Text variant="xs" color="mono60">
              Any notes on the work's condition, history, provenance, or anything else that our
              specialists may want to know.
            </Text>
            <Input
              multiline
              placeholder="Notes"
              accessibilityLabel="Notes"
              value={notes}
              onChangeText={setNotes}
            />
          </Flex>
        </Flex>
      </KeyboardAwareForm>

      <Animated.View
        style={stickyFooterStyle}
        onLayout={(event) => setStickyFooterHeight(event.nativeEvent.layout.height)}
      >
        <Box px={2} pt={2} bg="mono0" style={{ paddingBottom: bottom + space(2) }}>
          <Button block haptic variant="fillDark" disabled={!rating} onPress={onContinue}>
            Continue
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
      ...SellWorkCard_artwork
    }
  }
`
