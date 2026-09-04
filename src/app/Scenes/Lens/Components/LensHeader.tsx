import { BackButton, DEFAULT_HIT_SLOP, Flex, NAVBAR_HEIGHT } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LensHeaderProps {
  onClose: () => void
}

export const LensHeader: React.FC<LensHeaderProps> = ({ onClose }) => {
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
    </Flex>
  )
}
