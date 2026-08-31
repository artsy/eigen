import { PhotographIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"

/**
 * The button's own fill, chosen to contrast with the surface it sits on: "dark" for light surfaces
 * (the search overlay, the results grid), "light" for the black Lens screens.
 */
export type SearchByPhotoButtonVariant = "dark" | "light"

interface SearchByPhotoButtonProps {
  onPress: () => void
  testID?: string
  variant?: SearchByPhotoButtonVariant
}

const LABEL = "Search by photo"

/**
 * The Artsy Lens entry point. Shared rather than duplicated (AGENTS.md) because it appears on three
 * surfaces that disagree about *where* it goes — the search overlay opens the `/lens` modal, while
 * the Lens screens return to the camera inside their own independent stack — but must not disagree
 * about how it looks. Hence `onPress` as a prop instead of navigation owned in here.
 *
 * The full-width pill shape is intentionally not palette's `Button`: the rounded-25 capsule with a
 * leading icon is its own affordance in the search overlay's design, and `Button` has no variant
 * that produces it.
 */
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
