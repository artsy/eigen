import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingOfferSettings: React.FC = ({ children }) => {
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
    !isDismissed("offer-settings").status &&
    !!isDismissed("signal-interest").status &&
    isFocused
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("offer-settings")
  }

  return (
    <Popover
      visible={!!isDisplayable && isActive}
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
