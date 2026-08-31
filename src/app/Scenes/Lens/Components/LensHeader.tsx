import { BackButton, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LensHeaderProps {
  onClose: () => void
  title?: string
}

/**
 * Merges the deleted 2022 `HeaderContainer` / `HeaderBackButton` / `HeaderTitle` into one
 * component. Shared by every screen in the Lens flow, and meant to sit absolutely over the
 * full-bleed surface below it rather than inline in a flex flow — see `LensCamera`'s comment on why
 * that positioning is load-bearing there.
 *
 * `title` is optional because `LensAnalyzing` deliberately shows a bare close button: its own
 * "Searching for matches..." caption is the only label that screen needs.
 */
export const LensHeader: React.FC<LensHeaderProps> = ({ onClose, title }) => {
  const insets = useSafeAreaInsets()
  const space = useSpace()

  return (
    <Flex mt={`${insets.top}px`} height={44} flexDirection="row" alignItems="center" px={2}>
      <BackButton
        color="mono0"
        showX
        onPress={onClose}
        hitSlop={{ top: space(2), left: space(2), right: space(2), bottom: space(2) }}
      />

      {!!title && (
        <Flex position="absolute" left={0} right={0} alignItems="center" pointerEvents="none">
          <Text variant="sm-display" color="mono0">
            {title}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
