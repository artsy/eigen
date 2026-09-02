import { BackButton, DEFAULT_HIT_SLOP, Flex, NAVBAR_HEIGHT, Text } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LensHeaderProps {
  onClose: () => void
  title?: string
}

export const LensHeader: React.FC<LensHeaderProps> = ({ onClose, title }) => {
  const insets = useSafeAreaInsets()

  return (
    <Flex
      mt={`${insets.top}px`}
      height={NAVBAR_HEIGHT}
      flexDirection="row"
      alignItems="center"
      px={2}
    >
      <BackButton color="mono0" showX onPress={onClose} hitSlop={DEFAULT_HIT_SLOP} />

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
