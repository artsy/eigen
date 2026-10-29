import { Box, Flex, Text, useColor } from "@artsy/palette-mobile"
import { SELL_STEPS } from "app/Scenes/Sell/sellSteps"
import { Fragment, useEffect } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const DOT_SIZE = 24
// The xs variant's 20px line height leaves the 13px digit sitting low in the dot
const NUMBER_LINE_HEIGHT = 13
const FILL_DURATION = 300

interface SellStepperProps {
  currentStepIndex: number
}

export const SellStepper: React.FC<SellStepperProps> = ({ currentStepIndex }) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      accessible
      accessibilityLabel={`Step ${currentStepIndex + 1} of ${SELL_STEPS.length}`}
    >
      {SELL_STEPS.map((step, index) => {
        const isReached = index <= currentStepIndex

        return (
          <Fragment key={step.name}>
            {index > 0 && <SellStepperConnector isFilled={isReached} />}

            <Flex
              width={DOT_SIZE}
              height={DOT_SIZE}
              borderRadius={DOT_SIZE / 2}
              borderWidth={1}
              borderColor={isReached ? "blue100" : "mono30"}
              bg={isReached ? "blue100" : "mono0"}
              alignItems="center"
              justifyContent="center"
            >
              <Text
                variant="xs"
                color={isReached ? "white" : "mono60"}
                style={{ lineHeight: NUMBER_LINE_HEIGHT, includeFontPadding: false }}
              >
                {index + 1}
              </Text>
            </Flex>
          </Fragment>
        )
      })}
    </Flex>
  )
}

const SellStepperConnector: React.FC<{ isFilled: boolean }> = ({ isFilled }) => {
  const color = useColor()
  const progress = useSharedValue(isFilled ? 1 : 0)

  useEffect(() => {
    progress.set(withTiming(isFilled ? 1 : 0, { duration: FILL_DURATION }))
  }, [isFilled, progress])

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.get() * 100}%`,
  }))

  return (
    <Box flex={1} height={1} bg="mono30">
      <Animated.View style={[{ height: "100%", backgroundColor: color("blue100") }, fillStyle]} />
    </Box>
  )
}
