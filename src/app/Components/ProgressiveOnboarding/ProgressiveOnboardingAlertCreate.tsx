import { Box, Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import {
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_READY,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER,
  useProgressiveOnboarding,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingContext"
import { ProgressiveOnboardingPopover } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPopover"

import { FC, ReactNode } from "react"

interface ProgressiveOnboardingAlertCreateProps {
  children: (actions: { onSkip(): void }) => ReactNode
}

export const ProgressiveOnboardingAlertCreate: FC<ProgressiveOnboardingAlertCreateProps> = ({
  children,
}) => {
  const { dismiss, isDismissed, isEnabledFor } = useProgressiveOnboarding()
  const isDisplayable = isEnabledFor("alerts") && !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_CREATE)

  const handleDismiss = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CREATE)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_READY)
  }

  const handleNext = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CREATE)
  }

  const handleClose = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CREATE)
  }

  if (!isDisplayable) {
    return <>{children({ onSkip: () => {} })}</>
  }

  return (
    <ProgressiveOnboardingPopover
      name={PROGRESSIVE_ONBOARDING_ALERT_CREATE}
      ignoreClickOutside
      onClose={handleClose}
      variant="defaultLight"
      popover={({ onHide }: { onHide: () => void }) => {
        return (
          <Box py={1}>
            <Text variant="xs" fontWeight="bold">
              Hunting for a particular artwork?
            </Text>

            <Spacer y={1} />

            <OpaqueImageView
              imageURL="https://files.artsy.net/images/ProgOnboard.jpg"
              width={230}
              height={167}
            />

            <Spacer y={2} />

            <Text variant="xs">
              Set the filters for the artwork you’re looking for, then create your alert. We’ll let
              you know when there’s a matching work.
            </Text>

            <Spacer y={2} />

            <Flex>
              <Button
                size="small"
                variant="fillDark"
                flex={1}
                onPress={() => {
                  onHide()
                  handleNext()
                }}
              >
                Learn More
              </Button>

              <Spacer x={1} />

              <Button
                size="small"
                variant="fillDark"
                flex={1}
                onPress={() => {
                  onHide()
                  handleDismiss()
                }}
              >
                Got It
              </Button>
            </Flex>
          </Box>
        )
      }}
    >
      {children({ onSkip: handleDismiss })}
    </ProgressiveOnboardingPopover>
  )
}
