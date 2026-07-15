import { ContextModule, OwnerType } from "@artsy/cohesion"
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
import { ArtistListItemNew_artist$key } from "__generated__/ArtistListItemNew_artist.graphql"
import { OnboardingProgressBadge } from "app/Components/OnboardingProgressBadge/OnboardingProgressBadge"
import { StepProgressBar } from "app/Components/StepProgressBar/StepProgressBar"
import { FollowArtistsOrderedSetScreen } from "app/Scenes/Onboarding/Screens/Onboarding/Components/FollowArtistsOrderedSet"
import {
  ArtistRef,
  FollowedArtistsBank,
} from "app/Scenes/Onboarding/Screens/Onboarding/Components/FollowedArtistsBank"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import { OnboardingSearchResultsScreen } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingSearchResults"
import { GlobalStore } from "app/store/GlobalStore"
import { OnboardingFollowedArtist } from "app/store/OnboardingModel"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"
import { KeyboardController, KeyboardStickyView } from "react-native-keyboard-controller"

const MIN_FOLLOWED = 3
const SET_ID = "onboarding:suggested-artists"

export const FollowArtists: React.FC = () => {
  const { trackCompletedOnboarding, trackTappedSkip } = useOnboardingTracking()
  const [query, setQuery] = useState("")
  const [followedArtistRefs, setFollowedArtistRefs] = useState<ArtistRef[]>([])

  const count = followedArtistRefs.length

  const { debouncedValue } = useDebouncedValue({ value: query, delay: 200 })

  const handleCancel = () => {
    setQuery("")
    KeyboardController.dismiss()
  }

  const handleArtistFollowed = (
    artistRef: ArtistListItemNew_artist$key,
    artist: OnboardingFollowedArtist,
    slug: string
  ) => {
    setFollowedArtistRefs((prev) => [
      { ref: artistRef, internalID: artist.internalID, slug },
      ...prev,
    ])
    GlobalStore.actions.onboarding.addFollowedOnboardingArtist(artist)
  }

  const handleArtistUnfollowed = (internalID: string) => {
    setFollowedArtistRefs((prev) => prev.filter((a) => a.internalID !== internalID))
    GlobalStore.actions.onboarding.removeFollowedOnboardingArtist(internalID)
  }

  return (
    <Screen>
      <Screen.Header
        leftElements={<OnboardingProgressBadge current={count} total={MIN_FOLLOWED} />}
        rightElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Skip new user onboarding"
            onPress={() => {
              trackTappedSkip(ContextModule.onboardingFlow, OwnerType.onboarding)
              trackCompletedOnboarding()
              GlobalStore.actions.onboarding.setOnboardingState("complete")
            }}
            hitSlop={DEFAULT_HIT_SLOP}
            haptic
          >
            <Text>Skip</Text>
          </Touchable>
        }
      />
      <Flex px={2}>
        <StepProgressBar current={count} total={MIN_FOLLOWED} />
      </Flex>

      <Screen.Body disableKeyboardAvoidance>
        <Box mt={2}>
          <Text variant="lg-display">Tell us which artists you're interested in?</Text>
          <Text variant="sm-display" color="mono60" mt={1}>
            Follow {MIN_FOLLOWED} or more artists to see more of their work.
          </Text>
        </Box>
        <Spacer y={2} />
        <Flex backgroundColor="mono0" flex={1}>
          <Flex flexDirection="row" alignItems="center" gap={1}>
            <Flex flex={1}>
              <SearchInput placeholder="Search Artists" onChangeText={setQuery} value={query} />
            </Flex>
            {!!query && (
              <Touchable
                accessibilityRole="button"
                onPress={handleCancel}
                hitSlop={DEFAULT_HIT_SLOP}
                haptic
              >
                <Text variant="sm-display" color="mono60">
                  Cancel
                </Text>
              </Touchable>
            )}
          </Flex>
          <Spacer y={2} />

          {debouncedValue.length >= 2 ? (
            <OnboardingSearchResultsScreen
              term={debouncedValue}
              entities="ARTIST"
              onArtistFollowed={handleArtistFollowed}
              onArtistUnfollowed={handleArtistUnfollowed}
            />
          ) : (
            <FollowArtistsOrderedSetScreen
              id={SET_ID}
              hasFollowedArtists={count > 0}
              hideFollowedArtists
              onArtistFollowed={handleArtistFollowed}
              listHeaderComponent={
                <FollowedArtistsBank
                  artistRefs={followedArtistRefs}
                  onArtistUnfollowed={handleArtistUnfollowed}
                />
              }
            />
          )}
        </Flex>
        <KeyboardStickyView>
          <Flex p={2} backgroundColor="mono0">
            <Button
              block
              disabled={count < MIN_FOLLOWED}
              onPress={() => {
                trackCompletedOnboarding()
                GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)
                GlobalStore.actions.onboarding.setOnboardingState("complete")
              }}
            >
              Continue to Artsy
            </Button>
          </Flex>
        </KeyboardStickyView>
      </Screen.Body>
    </Screen>
  )
}
