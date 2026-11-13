import { MicrophoneIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Touchable, useColor } from "@artsy/palette-mobile"
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
} from "react-native-reanimated"

// While listening, the rings show a thin halo even in silence and spread out as the voice gets
// louder, so the user can see they are being heard.
const VOLUME_RINGS = [
  { opacity: 0.15, restingScale: 1.15, loudestScale: 1.4 },
  { opacity: 0.08, restingScale: 1.15, loudestScale: 1.7 },
]
const VOLUME_SPRING = { damping: 14, stiffness: 180 }

interface ArtAssistantVoiceInputButtonProps {
  /** Shows the stop button. */
  isListening: boolean
  /** Shows the volume rings; false while the recognizer is still starting. */
  isHearing: boolean
  onPress: () => void
  size: number
  volume: SharedValue<number>
}

export const ArtAssistantVoiceInputButton: React.FC<ArtAssistantVoiceInputButtonProps> = ({
  isHearing,
  isListening,
  onPress,
  size,
  volume,
}) => {
  return (
    <Flex alignItems="center" height={size} justifyContent="center" width={size}>
      {!!isHearing &&
        VOLUME_RINGS.map((ring, index) => (
          <VolumeRing key={index} {...ring} size={size} volume={volume} />
        ))}

      <Touchable
        accessibilityLabel={isListening ? "Stop dictation" : "Dictate a prompt"}
        accessibilityRole="button"
        hitSlop={DEFAULT_HIT_SLOP}
        onPress={onPress}
        underlayColor="transparent"
      >
        <Flex
          alignItems="center"
          backgroundColor={isListening ? "blue100" : "mono10"}
          borderRadius={size / 2}
          height={size}
          justifyContent="center"
          width={size}
        >
          {isListening ? (
            <Flex
              backgroundColor="mono0"
              borderRadius={1}
              height={size * 0.35}
              width={size * 0.35}
            />
          ) : (
            <MicrophoneIcon fill="mono100" height={size / 2} width={size / 2} />
          )}
        </Flex>
      </Touchable>
    </Flex>
  )
}

interface VolumeRingProps {
  loudestScale: number
  opacity: number
  restingScale: number
  size: number
  volume: SharedValue<number>
}

const VolumeRing: React.FC<VolumeRingProps> = ({
  loudestScale,
  opacity,
  restingScale,
  size,
  volume,
}) => {
  const color = useColor()
  const isReducedMotionEnabled = useReducedMotion()

  const animatedStyle = useAnimatedStyle(() => {
    // With Reduce Motion on, the ring keeps still at its resting size and only says "listening".
    const scale = isReducedMotionEnabled
      ? restingScale
      : withSpring(restingScale + (loudestScale - restingScale) * volume.get(), VOLUME_SPRING)

    return { transform: [{ scale }] }
  })

  return (
    <Animated.View
      testID="art-assistant-voice-input-ring"
      style={[
        {
          backgroundColor: color("blue100"),
          borderRadius: size / 2,
          height: size,
          opacity,
          pointerEvents: "none",
          position: "absolute",
          width: size,
        },
        animatedStyle,
      ]}
    />
  )
}
