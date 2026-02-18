import { Flex, Popover, Text } from "@artsy/palette-mobile"
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
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { hasSavedArtworks } = GlobalStore.useAppState((state) => state.infiniteDiscovery)

  const showSaveAlertReminder1 =
    index === FIRST_REMINDER_SWIPES_COUNT &&
    !isDismissed(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1).status &&
    isReady
  const showSaveAlertReminder2 =
    index === SECOND_REMINDER_SWIPES_COUNT &&
    !isDismissed(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2).status &&
    isReady

  const dismissPopover = () => {
    switch (index) {
      case FIRST_REMINDER_SWIPES_COUNT:
        dismiss(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1)
        break

      case SECOND_REMINDER_SWIPES_COUNT:
        dismiss(PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2)
        break
      default:
        break
    }
  }

  if (isTopCard && !hasSavedArtworks && (showSaveAlertReminder1 || showSaveAlertReminder2)) {
    return (
      <Popover
        visible
        onDismiss={dismissPopover}
        onPressOutside={dismissPopover}
        title={
          <Text variant="xs" color="mono0" fontWeight="bold">
            Save artworks to get better{"\n"}recommendations and to signal your{"\n"}interest to
            galleries.
          </Text>
        }
        placement="top"
      >
        {children}
      </Popover>
    )
  }
  return <Flex>{children}</Flex>
}

const FIRST_REMINDER_SWIPES_COUNT = 4
const SECOND_REMINDER_SWIPES_COUNT = 29
