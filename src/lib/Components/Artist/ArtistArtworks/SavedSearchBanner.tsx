import { Button, Flex, Text } from "palette"
import React from "react"

interface SavedSearchBannerProps {
  enabled: boolean
  loading?: boolean
  onPress: () => void
}

export const SavedSearchBanner: React.FC<SavedSearchBannerProps> = ({ enabled, loading, onPress }) => {
  return (
    <Flex backgroundColor="white" flexDirection="row" mx={-2} px={2} py={11} justifyContent="space-between" alignItems="center">
      <Text variant="small" color="black">
        New works alert for this search
      </Text>
      <Button
        variant={enabled ? "secondaryOutline" : "primaryBlack"}
        onPress={onPress}
        size="small"
        loading={loading}
        longestText="Disable"
        haptic
      >
        {enabled ? "Disable" : "Enable"}
      </Button>
    </Flex>
  )
}
