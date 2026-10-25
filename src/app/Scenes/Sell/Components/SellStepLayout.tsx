import { Button, Flex, useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SellStepLayoutProps {
  buttonLabel: string
  onButtonPress: () => void
}

export const SellStepLayout: React.FC<React.PropsWithChildren<SellStepLayoutProps>> = ({
  buttonLabel,
  onButtonPress,
  children,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()

  return (
    <Flex flex={1} bg="mono0" px={2} style={{ paddingBottom: bottom + space(2) }}>
      <Flex flex={1}>{children}</Flex>

      <Button block haptic variant="fillDark" onPress={onButtonPress}>
        {buttonLabel}
      </Button>
    </Flex>
  )
}
