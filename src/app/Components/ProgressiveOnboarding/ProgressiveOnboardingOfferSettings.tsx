import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
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
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  const isDisplayable =
    isPartnerOfferEnabled &&
    isReady &&
    !isDismissed("offer-settings").status &&
    !!isDismissed("signal-interest").status &&
    isFocused &&
    isInView
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("offer-settings")
  }

  if (isDisplayable && isActive) {
    return (
      <Popover
        visible
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
        <Flex pointerEvents="none">{children}</Flex>
      </Popover>
    )
  }

  if (isInView) {
    return <>{children}</>
  }

  return <ElementInView onVisible={() => setIsInView(true)}>{children}</ElementInView>
}
