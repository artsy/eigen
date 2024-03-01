import { Flex, Text } from "@artsy/palette-mobile"
import App0 from "app/Scenes/Playground/Animation/L0-Reanimated"
import App1 from "app/Scenes/Playground/Animation/L1-Animated-Components"
import App2 from "app/Scenes/Playground/Animation/L2-Shared-Values"
import App3 from "app/Scenes/Playground/Animation/L3-Moti"
import App4 from "app/Scenes/Playground/Animation/L4-Gestures"
import App5 from "app/Scenes/Playground/Animation/L5-Exercice"

// eslint-disable-next-line prefer-const
let LEVEL = 5

export const Animations = () => {
  const Content = () => {
    switch (LEVEL) {
      case 0:
        return <App0 />
      case 1:
        return <App1 />
      case 2:
        return <App2 />
      case 3:
        return <App3 />
      case 4:
        return <App4 />
      case 5:
        return <App5 />
      default:
        return null
    }
  }

  return (
    <Flex>
      <Flex backgroundColor="black10" p={2}>
        <Text variant="sm-display" fontWeight="bold" textAlign="center">
          Animations with Reanimated 3
        </Text>
      </Flex>
      <Content />
    </Flex>
  )
}
