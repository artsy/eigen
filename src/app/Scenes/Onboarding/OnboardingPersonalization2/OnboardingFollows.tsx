import { SearchInput } from "app/Components/SearchInput"
import { Box, Button, Flex, Spacer, Text } from "palette"
import { useState } from "react"
import { useScreenDimensions } from "shared/hooks"
import { useDebouncedValue } from "shared/hooks/useDebouncedValue"
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
  const {
    safeAreaInsets: { top },
  } = useScreenDimensions()
  const { debouncedValue } = useDebouncedValue({ value: query, delay: 200 })

  const { title, placeholder, entities, setId } = CONFIGURATION[kind]

  return (
    <Flex flex={1} flexGrow={1} backgroundColor="white100" pt={top} px={2}>
      {!debouncedValue && (
        <Box mt={2}>
          <Text variant="lg">{title}</Text>
        </Box>
      )}
      <Spacer mt={2} />
      <Flex backgroundColor="white" flex={1}>
        <SearchInput enableCancelButton placeholder={placeholder} onChangeText={setQuery} />
        {debouncedValue.length >= 2 ? (
          <OnboardingSearchResultsScreen term={debouncedValue} entities={entities} />
        ) : (
          <OnboardingOrderedSetScreen id={setId} />
        )}
      </Flex>
      <Flex p={2} position="absolute" left={0} right={0} bottom={0} backgroundColor="white">
        <Button variant="fillDark" block onPress={() => console.warn("finished")}>
          Done
        </Button>
      </Flex>
    </Flex>
  )
}
