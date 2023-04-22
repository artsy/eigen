import { Flex, Button } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface BrowseMoreRailCardProps {
  dark?: boolean
  onPress: () => void
  text: string
}

export const BrowseMoreRailCard: React.FC<BrowseMoreRailCardProps> = ({ dark, onPress, text }) => {
  const enableBrowseMoreRailCard = useFeatureFlag("AREnableBrowseMoreArtworksCard")

  if (!enableBrowseMoreRailCard) {
    return null
  }

  return (
    <Flex flex={1} px={1} mx={2} justifyContent="center">
      <Button
        variant={dark ? "outlineLight" : "outline"}
        onPress={onPress}
        accessibilityLabel={text}
      >
        {text}
      </Button>
    </Flex>
  )
}
