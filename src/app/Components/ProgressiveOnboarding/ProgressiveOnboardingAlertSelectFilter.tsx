import { Text } from "@artsy/palette-mobile"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"
import { FC, useEffect, useRef } from "react"

export const ProgressiveOnboardingAlertSelectFilter: FC = ({ children }) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()

  const appliedFilters = useRef(ArtworksFiltersStore.useStoreState((state) => state.appliedFilters))
  const initialFilterState = useRef(JSON.stringify(appliedFilters.current))

  const isDisplayable =
    isEnabledFor("alerts") &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_CREATE) &&
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER)

  const handleClose = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER)
  }

  const handleDismiss = () => {
    handleClose()
  }

  useEffect(() => {
    const isFilterStateChanged =
      initialFilterState.current !== JSON.stringify(appliedFilters.current)

    if (
      isEnabledFor("alerts") &&
      isFilterStateChanged &&
      !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER)
    ) {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER)
    }
  }, [dismiss, isEnabledFor, appliedFilters.current, isDismissed])

  if (!isDisplayable) {
    return <>{children}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER}
      placement="left-start"
      onClose={handleClose}
      onDismiss={handleDismiss}
      popover={<Text variant="xs">First, select the relevant filters.</Text>}
    >
      {children}
    </ProgressiveOnboardingPopover>
  )
}
