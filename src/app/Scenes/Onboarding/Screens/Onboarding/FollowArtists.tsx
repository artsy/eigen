import {
  Box,
  Button,
  DEFAULT_HIT_SLOP,
  Flex,
  Screen,
  SearchInput,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { OnboardingProgressBadge } from "app/Components/OnboardingProgressBadge/OnboardingProgressBadge"
import {
  StandaloneOnboardingProvider,
  useOnboardingContext,
} from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingContext"
import { OnboardingOrderedSetScreen } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingOrderedSet"
import { OnboardingSearchResultsScreen } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingSearchResults"
import { GlobalStore } from "app/store/GlobalStore"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MIN_FOLLOWED = 3

export const FollowArtists: React.FC = () => {
  return (
    <StandaloneOnboardingProvider>
      <FollowArtistsContent />
    </StandaloneOnboardingProvider>
  )
}

const FollowArtistsContent: React.FC = () => {
  const [query, setQuery] = useState("")
  const { bottom } = useSafeAreaInsets()
  const { state } = useOnboardingContext()
  const count = state.followedIds.length
  const setId = "onboarding:suggested-artists"

  const title = `Tell us which artists you’re interested in?`
  const subtitle = `Follow ${MIN_FOLLOWED} or more artists to see more of their work.`

  const { debouncedValue } = useDebouncedValue({ value: query, delay: 200 })

  const handleSkipPressed = () => {
    GlobalStore.actions.onboarding.setOnboardingState("complete")
  }

  return (
    <Screen>
      <Screen.Header
        leftElements={<OnboardingProgressBadge current={count} total={MIN_FOLLOWED} />}
        rightElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Skip new user onboarding"
            onPress={handleSkipPressed}
            hitSlop={DEFAULT_HIT_SLOP}
            haptic
          >
            <Text>Skip</Text>
          </Touchable>
        }
      />

      <Screen.Body>
        <Box mt={2}>
          <Text variant="lg-display">{title}</Text>
          <Text variant="sm-display" color="mono60" mt={1}>
            {subtitle}
          </Text>
        </Box>
        <Spacer y={2} />
        <Flex backgroundColor="mono0" flex={1}>
          <SearchInput placeholder="Search Artists" onChangeText={setQuery} value={query} />
          <Spacer y={2} />
          <Text variant="md">Leading artists on Artsy</Text>
          <Spacer y={2} />
          {debouncedValue.length >= 2 ? (
            <OnboardingSearchResultsScreen term={debouncedValue} entities="ARTIST" />
          ) : (
            <OnboardingOrderedSetScreen id={setId} />
          )}
        </Flex>
        <Flex pb={`${bottom}px`} pt={2}>
          <Button
            block
            disabled={count < MIN_FOLLOWED}
            onPress={() => GlobalStore.actions.onboarding.setOnboardingState("complete")}
          >
            Continue to Artsy
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
