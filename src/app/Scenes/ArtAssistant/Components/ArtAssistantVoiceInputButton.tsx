import { Flex, Touchable, useColor } from "@artsy/palette-mobile"
import { MicrophoneIcon } from "app/Components/Icons/MicrophoneIcon"
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
} from "react-native-reanimated"

const BUTTON_SIZE = 50
// While listening, the rings show a thin halo even in silence and spread out as the voice gets
// louder, so the user can see they are being heard.
const VOLUME_RINGS = [
  { opacity: 0.25, restingScale: 1.12, loudestScale: 1.35 },
  { opacity: 0.12, restingScale: 1.12, loudestScale: 1.6 },
]
const VOLUME_SPRING = { damping: 14, stiffness: 180 }

interface ArtAssistantVoiceInputButtonProps {
  /** Shows the stop button. */
  isListening: boolean
  /** Shows the volume rings; false while the recognizer is still starting. */
  isHearing: boolean
  onPress: () => void
  volume: SharedValue<number>
}

export const ArtAssistantVoiceInputButton: React.FC<ArtAssistantVoiceInputButtonProps> = ({
  isHearing,
  isListening,
  onPress,
  volume,
}) => {
  return (
    <Flex alignItems="center" height={BUTTON_SIZE} justifyContent="center" width={BUTTON_SIZE}>
      {!!isHearing &&
        VOLUME_RINGS.map((ring, index) => <VolumeRing key={index} {...ring} volume={volume} />)}

      <Touchable
        accessibilityLabel={isListening ? "Stop dictation" : "Dictate a prompt"}
        accessibilityRole="button"
        onPress={onPress}
        style={{ borderRadius: BUTTON_SIZE, overflow: "hidden" }}
      >
        <Flex
          alignItems="center"
          backgroundColor="blue100"
          borderRadius={BUTTON_SIZE}
          height={BUTTON_SIZE}
          justifyContent="center"
          width={BUTTON_SIZE}
        >
          {isListening ? (
            <Flex backgroundColor="mono0" borderRadius={2} height={14} width={14} />
          ) : (
            <MicrophoneIcon fill="mono0" height={22} width={22} />
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
  volume: SharedValue<number>
}

const VolumeRing: React.FC<VolumeRingProps> = ({ loudestScale, opacity, restingScale, volume }) => {
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
          borderRadius: BUTTON_SIZE / 2,
          height: BUTTON_SIZE,
          opacity,
          pointerEvents: "none",
          position: "absolute",
          width: BUTTON_SIZE,
        },
        animatedStyle,
      ]}
    />
  )
}
