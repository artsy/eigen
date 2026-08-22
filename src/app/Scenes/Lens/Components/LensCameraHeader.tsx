import { BackButton, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LensCameraHeaderProps {
  title: string
  onClose: () => void
}

/**
 * Merges the deleted 2022 `HeaderContainer` / `HeaderBackButton` / `HeaderTitle` into one
 * component. Sits absolutely over the full-bleed preview, not inline in a flex flow.
 */
export const LensCameraHeader: React.FC<LensCameraHeaderProps> = (props) => {
  const { title, onClose } = props
  const insets = useSafeAreaInsets()
  const space = useSpace()

  return (
    <Flex
      mt={`${insets.top}px`}
      height={44}
      flexDirection="row"
      alignItems="center"
      px={2}
    >
      <BackButton
        color="mono0"
        showX
        onPress={onClose}
        hitSlop={{ top: space(2), left: space(2), right: space(2), bottom: space(2) }}
      />

      <Flex position="absolute" left={0} right={0} alignItems="center" pointerEvents="none">
        <Text variant="sm-display" color="mono0">
          {title}
        </Text>
      </Flex>
    </Flex>
  )
}
