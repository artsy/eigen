import { SearchInput } from "app/Components/SearchInput"
import { Box, Button, Flex, Spacer, Text } from "palette"
import { useState } from "react"
import { useScreenDimensions } from "shared/hooks"
import { useDebouncedValue } from "shared/hooks/useDebouncedValue"
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
  const { next, state } = useOnboardingContext()

  const {
    safeAreaInsets: { top },
  } = useScreenDimensions()
  const { debouncedValue } = useDebouncedValue({ value: query, delay: 200 })

  const { title, placeholder, entities, setId } = CONFIGURATION[kind]

  const handleNextButtonPress = () => {
    next()
    // navigate to the loading screen and then to home after the delay
  }

  return (
    <Flex flex={1} flexGrow={1} backgroundColor="white100" pt={top} px={2}>
      {!debouncedValue && (
        // this will be animated with fade out when reanimated is merged
        <Box mt={2}>
          <Text variant="lg">{title}</Text>
        </Box>
      )}
      <Spacer mt={2} />
      <Flex backgroundColor="white" flex={1}>
        <SearchInput placeholder={placeholder} onChangeText={setQuery} />
        {debouncedValue.length >= 2 ? (
          <OnboardingSearchResultsScreen term={debouncedValue} entities={entities} />
        ) : (
          <OnboardingOrderedSetScreen id={setId} />
        )}
      </Flex>
      <Flex p={2} position="absolute" left={0} right={0} bottom={0} backgroundColor="white100">
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
  )
}
