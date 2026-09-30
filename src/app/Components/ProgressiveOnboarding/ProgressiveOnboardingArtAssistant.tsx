import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text, THEMES } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_ART_ASSISTANT } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { ALWAYS_WHITE } from "app/utils/colors"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"

// The tooltip design uses the same dark Beta pill in both app themes.
const BETA_BADGE_BACKGROUND_COLOR = THEMES.v3dark.colors.mono10

export const ProgressiveOnboardingArtAssistant: React.FC<
  React.PropsWithChildren<{ isSearchOverlayVisible: boolean }>
> = ({ children, isSearchOverlayVisible }) => {
  const [isInView, setIsInView] = useState(false)
  const isFocused = useIsFocused()
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: PROGRESSIVE_ONBOARDING_ART_ASSISTANT,
    contextScreenOwnerType: OwnerType.search,
    contextModule: ContextModule.header,
  })

  const isDisplayable =
    isReady &&
    isFocused &&
    isInView &&
    !isSearchOverlayVisible &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ART_ASSISTANT).status
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)
  const { debouncedValue: isActiveAfterLayout } = useDebouncedValue({
    value: isActive,
    delay: 500,
  })

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_ART_ASSISTANT)
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
        <Flex flexDirection="row" alignItems="center">
          <Text variant="xs" color="mono0" weight="medium">
            Art Assistant
          </Text>
          <Flex
            borderRadius={15}
            ml={0.5}
            px={1}
            py={0.5}
            style={{ backgroundColor: BETA_BADGE_BACKGROUND_COLOR }}
          >
            <Text variant="xxs" color={ALWAYS_WHITE}>
              Beta
            </Text>
          </Flex>
        </Flex>
      }
      content={
        <Flex maxWidth={250}>
          <Text variant="xs" color="mono0">
            Describe what you want and we'll find it
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
