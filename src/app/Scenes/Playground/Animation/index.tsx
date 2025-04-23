import { Flex, Text } from "@artsy/palette-mobile"
import { L0IntroductionToReanimated } from "app/Scenes/Playground/Animation/L0-Reanimated"
import { L1AnimatedComponent } from "app/Scenes/Playground/Animation/L1-Animated-Components"
import { L2SharedValues } from "app/Scenes/Playground/Animation/L2-Shared-Values"
import { L3Moti } from "app/Scenes/Playground/Animation/L3-Moti"
import { L4Gestures } from "app/Scenes/Playground/Animation/L4-Gestures"
import { Exercice } from "app/Scenes/Playground/Animation/L5-Exercice"

// eslint-disable-next-line prefer-const
let LEVEL = 5

export const Animations = () => {
  const Content = () => {
    switch (LEVEL) {
      case 0:
        return <L0IntroductionToReanimated />
      case 1:
        return <L1AnimatedComponent />
      case 2:
        return <L2SharedValues />
      case 3:
        return <L3Moti />
      case 4:
        return <L4Gestures />
      case 5:
        return <Exercice />
      default:
        return null
    }
  }

  return (
    <Flex>
      <Flex backgroundColor="mono10" p={2}>
        <Text variant="sm-display" fontWeight="bold" textAlign="center">
          Animations with Reanimated 3
        </Text>
      </Flex>
      <Content />
    </Flex>
  )
}
