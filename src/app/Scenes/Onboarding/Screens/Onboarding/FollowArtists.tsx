import { Button, Flex, Screen, Text, Touchable } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MIN_FOLLOWED = 3

export const FollowArtists: React.FC = () => {
  const { bottom } = useSafeAreaInsets()
  const [count, setCount] = useState(0)

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Flex flexDirection="row" alignItems="center" gap={4}>
            <Touchable
              accessibilityRole="button"
              onPress={() => setCount((c) => Math.max(0, c - 1))}
              disabled={count === 0}
            >
              <Text variant="xxl" fontWeight="bold" color={count === 0 ? "mono30" : "mono100"}>
                −
              </Text>
            </Touchable>
            <Text variant="xxl">{count}</Text>
            <Touchable accessibilityRole="button" onPress={() => setCount((c) => c + 1)}>
              <Text variant="xxl" fontWeight="bold">
                +
              </Text>
            </Touchable>
          </Flex>
        </Flex>
        <Flex pb={`${bottom}px`}>
          <Button
            block
            disabled={count < MIN_FOLLOWED}
            onPress={() => GlobalStore.actions.onboarding.setOnboardingState("complete")}
          >
            Continue to Artsy
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
