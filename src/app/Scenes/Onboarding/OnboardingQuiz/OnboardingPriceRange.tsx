import {
  Spacer,
  Text,
  Box,
  LegacyScreen,
  Button,
  Touchable,
  CloseIcon,
  ChevronIcon,
  DEFAULT_HIT_SLOP,
  ProgressBar,
  Flex,
} from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { Select, SelectOption } from "app/Components/Select"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { useOnboardingTracking } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingTracking"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { debounce } from "lodash"
import React, { useCallback, useState } from "react"

const DESCRIPTION = `Setting your price range helps us show you the most relevant artworks and investment opportunities.`

export const OnboardingPriceRange = () => {
  const { navigate, canGoBack, goBack } = useNavigation()
  const { dispatch, back, next, onDone, progress, state } = useOnboardingContext()
  const { trackAnsweredPriceRange } = useOnboardingTracking()
  const [priceRange, setPriceRange] = useState<string>(state.priceRange || "")

  const handleNext = useCallback(() => {
    if (priceRange) {
      const [priceRangeMin, priceRangeMax] = priceRange.split(":").map((n) => parseInt(n, 10))

      dispatch({
        type: "SET_PRICE_RANGE",
        payload: { priceRange, priceRangeMin, priceRangeMax },
      })

      trackAnsweredPriceRange(priceRange)
      next()
    }
    // @ts-expect-error
    navigate("OnboardingQuestionThree")
  }, [dispatch, navigate, priceRange, trackAnsweredPriceRange, next])

  const handleBack = useCallback(() => {
    back()
    if (canGoBack()) {
      goBack()
    }
  }, [back, canGoBack, goBack])

  const androidHardwareBackButtonHandler = () => {
    handleBack()
    return true
  }

  useBackHandler(androidHardwareBackButtonHandler)

  const isDisabled = !priceRange || priceRange === ""

  const debouncedHandleSkip = debounce(onDone, 1000)

  return (
    <LegacyScreen>
      <LegacyScreen.Body>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" height={40}>
          <Touchable accessibilityRole="button" onPress={handleBack} hitSlop={DEFAULT_HIT_SLOP}>
            <ChevronIcon direction="left" />
          </Touchable>

          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            testID="close-button"
            onPress={debouncedHandleSkip}
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <CloseIcon />
          </Touchable>
        </Flex>

        <Box pt={2}>
          <ProgressBar progress={progress} />
        </Box>

        <Flex flex={1} flexDirection="column">
          <Spacer y={2} />
          <Text variant="lg-display">What's your price range?</Text>
          <Spacer y={1} />
          <Text variant="sm">{DESCRIPTION}</Text>
          <Spacer y={4} />

          <Select
            title="Price Range"
            options={PRICE_BUCKETS}
            enableSearch={false}
            value={priceRange}
            onSelectValue={(value) => {
              setPriceRange(value)
            }}
          />
        </Flex>

        <Flex>
          <Button block disabled={isDisabled} onPress={handleNext}>
            Next
          </Button>
          <LegacyScreen.SafeBottomPadding />
        </Flex>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}

export const PRICE_BUCKETS: Array<SelectOption<string>> = [
  { label: "Select a price range", value: "" },
  { label: "Under $500", value: "-1:500" },
  { label: "Under $2,500", value: "-1:2500" },
  { label: "Under $5,000", value: "-1:5000" },
  { label: "Under $10,000", value: "-1:10000" },
  { label: "Under $25,000", value: "-1:25000" },
  { label: "Under $50,000", value: "-1:50000" },
  { label: "Under $100,000", value: "-1:100000" },
  { label: "No budget in mind", value: "-1:1000000000000" },
]
