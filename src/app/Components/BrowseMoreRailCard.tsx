import { Flex } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Button } from "palette"

interface BrowseMoreRailCardProps {
  dark?: boolean
  onPress: () => void
  text: string
}

export const BrowseMoreRailCard: React.FC<BrowseMoreRailCardProps> = ({ dark, onPress, text }) => {
  const enableBrowseMoreRailCard = useFeatureFlag("AREnableBrowseMoreRailCard")

  if (!enableBrowseMoreRailCard) {
    return null
  }

  return (
    <Flex flex={1} px={1} mx={2} justifyContent="center">
      <Button
        variant={dark ? "outlineLight" : "outline"}
        onPress={onPress}
        accessibilityLabel="Browse All Artworks"
      >
        {text}
      </Button>
    </Flex>
  )
}
