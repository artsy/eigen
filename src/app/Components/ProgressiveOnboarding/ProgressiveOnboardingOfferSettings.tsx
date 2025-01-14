import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_OFFER_SETTINGS,
  PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST,
} from "app/store/ProgressiveOnboardingModel"
import { ElementInView } from "app/utils/ElementInView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"

export const ProgressiveOnboardingOfferSettings: React.FC = ({ children }) => {
  const [isInView, setIsInView] = useState(false)
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")

  const isDisplayable =
    isArtworkListOfferabilityEnabled &&
    isReady &&
    !isDismissed(PROGRESSIVE_ONBOARDING_OFFER_SETTINGS).status &&
    !!isDismissed(PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST).status &&
    isFocused &&
    isInView

  const { clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_OFFER_SETTINGS)
  }

  if (isInView) {
    return (
      <Popover
        visible={!!isDisplayable}
        onDismiss={handleDismiss}
        onPressOutside={handleDismiss}
        onCloseComplete={clearActivePopover}
        placement="top"
        title={
          <Text variant="xs" color="white100">
            Edit list settings to indicate to{"\n"}galleries which artworks you want{"\n"}to receive
            offers on.
          </Text>
        }
      >
        <Flex>{children}</Flex>
      </Popover>
    )
  }

  return <ElementInView onVisible={() => setIsInView(true)}>{children}</ElementInView>
}
