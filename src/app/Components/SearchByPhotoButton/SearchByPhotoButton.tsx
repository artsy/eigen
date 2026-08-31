import { PhotographIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"

// "dark" for light surfaces, "light" for the black Lens screens.
export type SearchByPhotoButtonVariant = "dark" | "light"

interface SearchByPhotoButtonProps {
  onPress: () => void
  testID?: string
  variant?: SearchByPhotoButtonVariant
}

const LABEL = "Search by photo"

// Room a pinned pill needs, so scroll containers underneath can pad their last item clear of it.
export const SEARCH_BY_PHOTO_BUTTON_SPACE = 58

export const SearchByPhotoButton: React.FC<SearchByPhotoButtonProps> = ({
  onPress,
  testID = "search-by-photo-button",
  variant = "dark",
}) => {
  const isDark = variant === "dark"
  const foreground = isDark ? "mono0" : "mono100"

  return (
    <Touchable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={LABEL}
      onPress={onPress}
    >
      <Flex
        bg={isDark ? "mono100" : "mono0"}
        borderRadius={25}
        height={50}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <PhotographIcon width={20} height={20} fill={foreground} />
        <Text variant="sm-display" color={foreground} ml={0.5} style={{ lineHeight: 20 }}>
          {LABEL}
        </Text>
      </Flex>
    </Touchable>
  )
}
