import { Box, Button, Flex, useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SellStepLayoutProps {
  buttonLabel: string
  buttonDisabled?: boolean
  onButtonPress: () => void
}

export const SellStepLayout: React.FC<React.PropsWithChildren<SellStepLayoutProps>> = ({
  buttonLabel,
  buttonDisabled,
  onButtonPress,
  children,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()

  return (
    <Flex flex={1} bg="mono0" style={{ paddingBottom: bottom + space(2) }}>
      <Flex flex={1}>{children}</Flex>

      <Box px={2} pt={2}>
        <Button block haptic variant="fillDark" disabled={buttonDisabled} onPress={onButtonPress}>
          {buttonLabel}
        </Button>
      </Box>
    </Flex>
  )
}
