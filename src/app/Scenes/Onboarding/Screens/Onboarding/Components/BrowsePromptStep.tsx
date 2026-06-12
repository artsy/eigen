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
    <Flex flex={1} px={2} backgroundColor="mono100">
      <Logo />
      <Flex flex={1} justifyContent="center">
        <Text variant="xl" color="mono0">
          Try our artwork browsing tool to start developing your tastes.
        </Text>
      </Flex>
      <AnimatedFlex
        pb={`${bottom}px`}
        gap={1}
        entering={FadeInRight.duration(BUTTONS_ENTERING_DURATION)
          .delay(BUTTONS_ENTERING_DELAY)
          .easing(Easing.out(Easing.quad))}
      >
        <Button variant="fillLight" block onPress={onNext}>
          Start browsing
        </Button>
        <Button variant="fillDark" block onPress={onSkip}>
          Skip to homepage
        </Button>
      </AnimatedFlex>
    </Flex>
  )
}
