import { Box, Button, Flex, useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SellStepLayoutProps {
  buttonLabel: string
  buttonDisabled?: boolean
  buttonLoading?: boolean
  onButtonPress: () => void
  /** How far the button area reaches above the bottom safe area */
  onFooterHeightChange?: (height: number) => void
}

export const SellStepLayout: React.FC<React.PropsWithChildren<SellStepLayoutProps>> = ({
  buttonLabel,
  buttonDisabled,
  buttonLoading,
  onButtonPress,
  onFooterHeightChange,
  children,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()

  return (
    <Flex flex={1} bg="mono0" style={{ paddingBottom: bottom + space(2) }}>
      <Flex flex={1}>{children}</Flex>

      <Box
        px={2}
        pt={2}
        onLayout={({ nativeEvent }) => onFooterHeightChange?.(nativeEvent.layout.height + space(2))}
      >
        <Button
          block
          haptic
          variant="fillDark"
          disabled={buttonDisabled}
          loading={buttonLoading}
          onPress={onButtonPress}
        >
          {buttonLabel}
        </Button>
      </Box>
    </Flex>
  )
}
