import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box, Button, Separator, useColor } from "palette"
import React from "react"

export interface ArtworkFilterApplyButtonProps {
  disabled: boolean
  onPress: () => void
}

export const ArtworkFilterApplyButton: React.FC<ArtworkFilterApplyButtonProps> = (props) => {
  const { disabled, onPress } = props
  const color = useColor()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  if (isEnabledImprovedAlertsFlow) {
    return (
      <Box
        p={2}
        backgroundColor="white"
        style={{
          shadowColor: color("black100"),
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <Button disabled={disabled} onPress={onPress} block width={100} variant="fillDark" size="large">
          Apply Filters
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Separator my={0} />
      <Box p={2} pb={30}>
        <Button disabled={disabled} onPress={onPress} block width={100} variant="fillDark" size="large">
          Show results
        </Button>
      </Box>
    </>
  )
}
