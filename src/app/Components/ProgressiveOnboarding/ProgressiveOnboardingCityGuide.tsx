import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { ProgressiveOnboardingKey } from "app/store/ProgressiveOnboardingModel"
import { Sentinel } from "app/utils/Sentinel"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useState } from "react"

interface Props {
  onboardingKey: ProgressiveOnboardingKey
  title: string
  description: string
  placement: "top" | "bottom"
  contextModule: ContextModule
}

export const ProgressiveOnboardingCityGuide: React.FC<React.PropsWithChildren<Props>> = ({
  onboardingKey,
  title,
  description,
  placement,
  contextModule,
  children,
}) => {
  const [isInView, setIsInView] = useState(false)
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: onboardingKey,
    contextScreenOwnerType: OwnerType.cityGuide,
    contextModule,
  })

  const isDisplayable = isReady && isFocused && isInView && !isDismissed(onboardingKey).status

  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const { debouncedValue: isVisible } = useDebouncedValue({
    value: isDisplayable && isActive,
    delay: 500,
  })

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(onboardingKey)
  }

  return (
    <Popover
      visible={!!isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      onOpenComplete={trackEvent}
      placement={placement}
      title={
        <Text variant="xs" color="mono0" weight="medium">
          {title}
        </Text>
      }
      content={
        <Flex maxWidth={250}>
          <Text variant="xs" color="mono0">
            {description}
          </Text>
        </Flex>
      }
    >
      <Flex>
        {/* The target can start below the fold, and the popover would point at nothing. */}
        <Sentinel onChange={(visible) => visible && setIsInView(true)}>{children}</Sentinel>
      </Flex>
    </Popover>
  )
}
