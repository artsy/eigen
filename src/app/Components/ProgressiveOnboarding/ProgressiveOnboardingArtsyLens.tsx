import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_ARTSY_LENS } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"

export const ProgressiveOnboardingArtsyLens: React.FC<
  React.PropsWithChildren<{
    isSearchOverlayVisible: boolean
    ownerType: ScreenOwnerType
  }>
> = ({ children, isSearchOverlayVisible, ownerType }) => {
  const [isInView, setIsInView] = useState(false)
  const isFocused = useIsFocused()
  const {
    isDismissed,
    sessionState: { isReady, deferHomeTooltipsThisSession },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: PROGRESSIVE_ONBOARDING_ARTSY_LENS,
    contextScreenOwnerType: ownerType,
    contextModule: ContextModule.header,
  })

  const isDisplayable =
    isReady &&
    isFocused &&
    isInView &&
    !isSearchOverlayVisible &&
    !(ownerType === OwnerType.home && deferHomeTooltipsThisSession) &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ARTSY_LENS).status
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)
  const { debouncedValue: isActiveAfterLayout } = useDebouncedValue({
    value: isActive,
    delay: 500,
  })

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_ARTSY_LENS)
  }

  return (
    <Popover
      visible={!!isDisplayable && isActiveAfterLayout}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      onOpenComplete={trackEvent}
      placement="bottom"
      title={
        <Text variant="xs" color="mono0" weight="medium">
          Artsy Lens
        </Text>
      }
      content={
        <Flex maxWidth={250}>
          <Text variant="xs" color="mono0">
            Take a picture of a work to find more like it
          </Text>
        </Flex>
      }
    >
      <Flex>
        <Sentinel onChange={(visible) => visible && setIsInView(true)}>{children}</Sentinel>
      </Flex>
    </Popover>
  )
}
