import { Button, Flex, Text } from "@artsy/palette-mobile"
import Animated, { Easing, FadeInRight } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Logo } from "./Logo"

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const BUTTONS_ENTERING_DURATION = 500
const BUTTONS_ENTERING_DELAY = 300

interface BrowsePromptStepProps {
  onNext: () => void
  onSkip: () => void
}

export const BrowsePromptStep: React.FC<BrowsePromptStepProps> = ({ onNext, onSkip }) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <Flex flex={1} px={2} backgroundColor="mono0">
      <Logo fill="mono100" />
      <Flex flex={1} justifyContent="center">
        <Text variant="xl" color="mono100">
          We'll show you a selection of art. To get started, save 5 that speak to you.
        </Text>
      </Flex>
      <AnimatedFlex
        pb={`${bottom}px`}
        gap={1}
        entering={FadeInRight.duration(BUTTONS_ENTERING_DURATION)
          .delay(BUTTONS_ENTERING_DELAY)
          .easing(Easing.out(Easing.quad))}
      >
        <Button variant="fillDark" block onPress={onNext}>
          Start browsing
        </Button>
        <Button variant="fillLight" block onPress={onSkip}>
          Skip to home
        </Button>
      </AnimatedFlex>
    </Flex>
  )
}
