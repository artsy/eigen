import { Spacer, Flex, Box, ProgressBar, Text, Button, LegacyScreen } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { SearchInput } from "app/Components/SearchInput"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"
import { OnboardingOrderedSetScreen } from "./OnboardingOrderedSet"
import { OnboardingSearchResultsScreen } from "./OnboardingSearchResults"

interface OnboardingFollowsProps {
  kind: "artists" | "galleries"
}

export const CONFIGURATION = {
  artists: {
    title: "Follow artists to see more of their work",
    placeholder: "Search Artists",
    entities: "ARTIST",
    setId: "onboarding:suggested-artists",
  },
  galleries: {
    title: "Follow galleries you love to see events and news",
    placeholder: "Search Galleries",
    entities: "PROFILE",
    setId: "onboarding:suggested-galleries",
  },
} as const

export const OnboardingFollows: React.FC<OnboardingFollowsProps> = ({ kind }) => {
  const [query, setQuery] = useState("")
  const { navigate } = useNavigation()
  const { next, state, onDone, progress } = useOnboardingContext()

  // prevents Android users from going back with hardware button
  useBackHandler(() => true)

  const { debouncedValue } = useDebouncedValue({ value: query, delay: 200 })

  const { title, placeholder, entities, setId } = CONFIGURATION[kind]

  const handleNextButtonPress = () => {
    next()
    // @ts-expect-error
    navigate("OnboardingPostFollowLoadingScreen")
  }

  return (
    <LegacyScreen>
      <LegacyScreen.Header onSkip={onDone} />
      <LegacyScreen.Body>
        {!debouncedValue && (
          <Box pt={2}>
            <ProgressBar progress={progress} />
          </Box>
        )}
        <Flex flex={1} backgroundColor="mono0">
          {!debouncedValue && (
            // this will be animated with fade out when reanimated is merged
            <Box mt={2}>
              <Text variant="lg-display">{title}</Text>
            </Box>
          )}
          <Spacer y={2} />
          <Flex backgroundColor="mono0" flex={1}>
            <SearchInput placeholder={placeholder} onChangeText={setQuery} value={query} />
            <Spacer y={2} />
            {debouncedValue.length >= 2 ? (
              <OnboardingSearchResultsScreen term={debouncedValue} entities={entities} />
            ) : (
              <OnboardingOrderedSetScreen id={setId} />
            )}
          </Flex>
          <Flex pt={2} position="absolute" left={0} right={0} bottom={0} backgroundColor="mono0">
            <Button
              variant="fillDark"
              disabled={state.followedIds.length === 0}
              block
              onPress={handleNextButtonPress}
            >
              Next
            </Button>
          </Flex>
        </Flex>
        <LegacyScreen.SafeBottomPadding />
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}
