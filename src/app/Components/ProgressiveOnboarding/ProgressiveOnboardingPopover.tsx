import { Box, Popover, PopoverProps } from "@artsy/palette-mobile"
import { Z } from "Apps/Components/constants"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { FC } from "react"

interface ProgressiveOnboardingPopoverProps extends Omit<PopoverProps, "children"> {
  name: string
}

export const ProgressiveOnboardingPopover: FC<ProgressiveOnboardingPopoverProps> = ({
  popover,
  children,
  name,
  ...rest
}) => {
  useProgressiveOnboardingTracking({ name })

  return (
    <Popover
      popover={popover}
      width={250}
      variant="defaultDark"
      pointer
      visible
      ignoreClickOutside
      zIndex={Z.popover}
      manageFocus={false}
      {...rest}
    >
      {({ anchorRef }) => {
        return <Box ref={anchorRef as any}>{children}</Box>
      }}
    </Popover>
  )
}
