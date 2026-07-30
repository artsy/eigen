import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import Animated, { Easing, FadeInRight } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Logo } from "./Logo"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const BUTTONS_ENTERING_DURATION = 500
const BUTTONS_ENTERING_DELAY = 300

interface BrowsePromptStepProps {
  onNext: () => void
}

export const BrowsePromptStep: React.FC<BrowsePromptStepProps> = ({ onNext }) => {
  const { bottom } = useSafeAreaInsets()

  const enteringAnim = FadeInRight.duration(BUTTONS_ENTERING_DURATION)
    .delay(BUTTONS_ENTERING_DELAY)
    .easing(Easing.out(Easing.quad))

  return (
    <Flex flex={1} px={2} backgroundColor="mono0">
      <Logo fill="mono100" />
      <Flex flex={1} justifyContent="center">
        <Text variant="xl" color="mono100">
          What art are you drawn to?
        </Text>
        <Spacer y={1} />
        <AnimatedFlex entering={enteringAnim}>
          <Text variant="lg-display" color="mono100">
            Save the works that catch your eye.
          </Text>
        </AnimatedFlex>
      </Flex>
      <AnimatedFlex pb={`${bottom}px`} gap={1} entering={enteringAnim}>
        <Button variant="fillDark" block onPress={onNext}>
          Start Swiping
        </Button>
      </AnimatedFlex>
    </Flex>
  )
}
