import { Text } from "@artsy/palette-mobile"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1,
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2,
} from "app/store/ProgressiveOnboardingModel"

interface InfiniteDiscoveryArtworkCardPopoverProps {
  isTopCard: boolean
  index: number
  children: React.JSX.Element
}

export const InfiniteDiscoveryArtworkCardPopover: React.FC<
  InfiniteDiscoveryArtworkCardPopoverProps
> = ({ children, index, isTopCard }) => {
  const {
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { hasSavedArtworks } = GlobalStore.useAppState((state) => state.infiniteDiscovery)
  const isNewUserOnboardingSession =
    GlobalStore.useAppState((state) => state.onboarding.onboardingState) === "incomplete"

  // Only two cards in the deck ever carry a reminder; the rest render nothing extra.
  const reminderKey =
    index === FIRST_REMINDER_SWIPES_COUNT
      ? PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1
      : index === SECOND_REMINDER_SWIPES_COUNT
        ? PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2
        : undefined

  if (!reminderKey) {
    return children
  }

  return (
    <OnboardingPopover
      id={reminderKey}
      when={!isNewUserOnboardingSession && !!isTopCard && !hasSavedArtworks && isReady}
      placement="top"
      title={
        <Text variant="xs" color="mono0" fontWeight="bold">
          Save artworks to get better{"\n"}recommendations and to signal your{"\n"}interest to
          galleries.
        </Text>
      }
    >
      {children}
    </OnboardingPopover>
  )
}

const FIRST_REMINDER_SWIPES_COUNT = 4
const SECOND_REMINDER_SWIPES_COUNT = 29
