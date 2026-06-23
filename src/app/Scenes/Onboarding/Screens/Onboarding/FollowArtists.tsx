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
import { FollowedArtistsBank } from "app/Scenes/Onboarding/Screens/Onboarding/Components/FollowedArtistsBank"
import { OnboardingOrderedSetScreen } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingOrderedSet"
import { OnboardingSearchResultsScreen } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingSearchResults"
import { GlobalStore } from "app/store/GlobalStore"
import { OnboardingFollowedArtist } from "app/store/OnboardingModel"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MIN_FOLLOWED = 3

export const FollowArtists: React.FC = () => {
  const [query, setQuery] = useState("")
  const { bottom } = useSafeAreaInsets()
  const count = GlobalStore.useAppState(
    (state) => state.onboarding.followedOnboardingArtists.length
  )
  const setId = "onboarding:suggested-artists"

  const { debouncedValue } = useDebouncedValue({ value: query, delay: 200 })

  const handleArtistFollowed = (artist: OnboardingFollowedArtist, wasFollowed: boolean) => {
    if (wasFollowed) {
      GlobalStore.actions.onboarding.removeFollowedOnboardingArtist(artist.internalID)
    } else {
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist(artist)
    }
  }

  return (
    <Screen>
      <Screen.Header
        leftElements={<OnboardingProgressBadge current={count} total={MIN_FOLLOWED} />}
        rightElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Skip new user onboarding"
            onPress={() => GlobalStore.actions.onboarding.setOnboardingState("complete")}
            hitSlop={DEFAULT_HIT_SLOP}
            haptic
          >
            <Text>Skip</Text>
          </Touchable>
        }
      />

      <Screen.Body>
        <Box mt={2}>
          <Text variant="lg-display">Tell us which artists you’re interested in?</Text>
          <Text variant="sm-display" color="mono60" mt={1}>
            Follow {MIN_FOLLOWED} or more artists to see more of their work.
          </Text>
        </Box>
        <Spacer y={2} />
        <Flex backgroundColor="mono0" flex={1}>
          <SearchInput placeholder="Search Artists" onChangeText={setQuery} value={query} />
          <Spacer y={2} />
          <FollowedArtistsBank />
          <Text variant="md">Leading artists on Artsy</Text>
          <Spacer y={2} />
          {debouncedValue.length >= 2 ? (
            <OnboardingSearchResultsScreen
              term={debouncedValue}
              entities="ARTIST"
              onArtistFollowed={handleArtistFollowed}
            />
          ) : (
            <OnboardingOrderedSetScreen id={setId} onArtistFollowed={handleArtistFollowed} />
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
