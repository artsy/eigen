import { Flex } from "palette"
import { useColor } from "palette/hooks"
import { Color } from "palette/Theme"
import { useEffect, useState } from "react"
import { Animated } from "react-native"
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

export interface ProgressBarProps {
  progress: number
  height?: number
  trackColor?: Color
  backgroundColor?: Color
  onCompletion?: () => void
}

const clamp = (num: number, min: number, max: number) => Math.max(min, Math.min(num, max))

export const ProgressBar = ({
  progress: unclampedProgress,
  height = 2,
  trackColor = "blue100",
  backgroundColor = "black30",
  onCompletion,
}: ProgressBarProps) => {
  const color = useColor()
  const width = useSharedValue("0%")
  const progress = clamp(unclampedProgress, 0, 100)
  const progressAnim = useAnimatedStyle(() => ({ width: width.value }))

  const [onCompletionCalled, setOnCompletionCalled] = useState(false)

  useEffect(() => {
    width.value = withTiming(`${progress}%`, { duration: 500 })

    if (progress === 100 && !onCompletionCalled) {
      onCompletion?.()
      setOnCompletionCalled(true)
    }
  }, [progress])

  return (
    <Flex width="100%" backgroundColor={backgroundColor} my={1}>
      <Animated.View
        testID="progress-bar-track"
        style={[progressAnim, { height, backgroundColor: color(trackColor) }]}
      />
    </Flex>
  )
}
