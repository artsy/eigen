import { Button, Flex } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"

interface BrowseMoreRailCardProps {
  dark?: boolean
  href?: string | null
  onPress?: () => void
  text?: string | null
}

export const BrowseMoreRailCard: React.FC<BrowseMoreRailCardProps> = ({
  dark,
  href,
  onPress,
  text,
}) => {
  return (
    <Flex flex={1} px={1} mx={2} justifyContent="center">
      <RouterLink hasChildTouchable to={href} onPress={onPress}>
        <Button
          variant={dark ? "outlineLight" : "outline"}
          accessibilityLabel={text ?? "Browse All Results"}
        >
          {text ?? "Browse All Results"}
        </Button>
      </RouterLink>
    </Flex>
  )
}
