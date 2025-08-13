import { ActionType, OwnerType } from "@artsy/cohesion"
import { SavedPriceRange } from "@artsy/cohesion/dist/Schema/Events/SavedPriceRange"
import { Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { PRICE_BUCKETS } from "app/Components/PriceRange/constants"
import { Select } from "app/Components/Select"
import { updateMyUserProfile } from "app/Scenes/MyAccount/updateMyUserProfile"
import { useCallback, useState } from "react"
import { useTracking } from "react-tracking"
import { OnboardingQuestionTemplate } from "./Components/OnboardingQuestionTemplate"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"
import { OnboardingNavigationStack } from "./OnboardingQuiz"

type Props = StackScreenProps<OnboardingNavigationStack, "OnboardingPriceRange">

export const OnboardingPriceRange: React.FC<Props> = () => {
  const { next, dispatch, state } = useOnboardingContext()
  const { navigate } = useNavigation<NavigationProp<OnboardingNavigationStack>>()
  const { trackEvent } = useTracking()

  const [priceRangeMin, setPriceRangeMin] = useState<number | null>(null)
  const [priceRangeMax, setPriceRangeMax] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleNext = useCallback(async () => {
    const priceRange = state.priceRange
    if (!priceRange || isLoading) {
      return
    }

    try {
      setIsLoading(true)
      setError(undefined)

      // Save the price range to the user's profile
      await updateMyUserProfile({ priceRangeMin, priceRangeMax })

      // Track the price range selection
      trackEvent(tracks.savePriceRange(priceRange))

      // Continue to the next screen in the onboarding flow
      next()

      navigate("OnboardingQuestionThree")
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }, [state.priceRange, priceRangeMin, priceRangeMax, isLoading, trackEvent, next, navigate])

  const handlePriceRangeChange = (value: string) => {
    // Update the onboarding state
    dispatch({ type: "SET_PRICE_RANGE", payload: value })

    // Update local state for API call
    if (value) {
      const [priceRangeMinStr, priceRangeMaxStr] = value.split(":")
      setPriceRangeMin(parseInt(priceRangeMinStr, 10))
      setPriceRangeMax(parseInt(priceRangeMaxStr, 10))
    } else {
      setPriceRangeMin(null)
      setPriceRangeMax(null)
    }
  }

  return (
    <OnboardingQuestionTemplate
      question="Artwork Budget"
      subtitle="Letting us know your maximum budget for an artwork helps us provide more relevant recommendations."
      action="SET_PRICE_RANGE"
      onNext={handleNext}
    >
      {/* Price Range Selection */}
      <Select
        title="Maximum Budget"
        options={PRICE_BUCKETS}
        enableSearch={false}
        value={state.priceRange || ""}
        onSelectValue={handlePriceRangeChange}
        hasError={!!error}
      />

      {!!error && (
        <>
          <Spacer y={1} />
          <Text variant="xs" color="red100">
            {error}
          </Text>
        </>
      )}
    </OnboardingQuestionTemplate>
  )
}

const tracks = {
  savePriceRange: (priceRange: string): SavedPriceRange => {
    return {
      action: ActionType.savedPriceRange,
      context_screen_owner_type: OwnerType.onboarding,
      value: priceRange,
    }
  },
}
