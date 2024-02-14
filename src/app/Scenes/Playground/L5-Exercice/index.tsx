import { BellFillIcon, BellIcon, Flex, Separator, Text } from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { ScrollView, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

export default function App() {
  const translateX = useSharedValue(0)
  const isIconVisible = useSharedValue(false)

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = !isIconVisible.value ? event.translationX : event.translationX - 50
    })
    .onEnd(() => {
      if (translateX.value < -50) {
        translateX.value = withSpring(-50)
        isIconVisible.value = true
      } else {
        translateX.value = withSpring(0)
        isIconVisible.value = false
      }
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <ScrollView>
      <Flex px={2}>
        <Text variant="lg-display">Gestures and animation</Text>

        <Text>
          In this example, we will create a simple gesture animation using the Pan gesture handler.
          {"\n"}
          1. We will create a rectange that will change its color and scale when we press.{"\n"}
          2. We will move it horizontally when we drag it
        </Text>
      </Flex>

      <Flex py={4}>
        <Solution1 />
        <Solution2 />
      </Flex>
      <Separator />
      <Flex py={4}>
        <Flex py={4}>
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "blue",
              alignSelf: "center",
            }}
          />
        </Flex>
      </Flex>
      <Separator />
      <Flex py={4}>
        <Flex py={4}>
          <GestureDetector gesture={pan}>
            <Animated.View>
              <Flex position="absolute" right={20} top={20}>
                <BellIcon height={24} width={24} />
              </Flex>

              <Animated.View style={animatedStyles}>
                <MenuItem
                  title="Yayoi Kusama"
                  description="Ephemera or Merchandise or Print, Limited Edition"
                  onPress={() => {}}
                  style={{ backgroundColor: "white" }}
                />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </Flex>
      </Flex>
    </ScrollView>
  )
}

const Solution1 = () => {
  const pressed = useSharedValue(false)
  const offset = useSharedValue(0)

  const tap = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true
    })
    .onChange((event) => {
      offset.value = event.translationX
    })
    .onFinalize(() => {
      offset.value = withTiming(0)
      pressed.value = false
    })

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: pressed.value ? "red" : "violet",
    transform: [{ translateX: offset.value }, { scale: withTiming(pressed.value ? 1.2 : 1) }],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          {
            width: 100,
            height: 100,
            backgroundColor: "violet",
            alignSelf: "center",
          },
          animatedStyles,
        ]}
      />
    </GestureDetector>
  )
}

const THRESHOLD = -100

const Solution2 = () => {
  const dragX = useSharedValue(0)

  const tap = Gesture.Pan()
    .onStart(() => {})
    .onChange((event) => {
      dragX.value = event.translationX + (dragX.value === THRESHOLD ? THRESHOLD : 0)
    })
    .onFinalize(() => {
      if (dragX.value < THRESHOLD) {
        dragX.value = withTiming(-100)
      } else {
        dragX.value = withTiming(0)
      }
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: dragX.value,
      },
    ],
  }))

  return (
    <GestureDetector gesture={tap}>
      <View
        style={[
          {
            width: "100%",
            alignSelf: "center",
          },
        ]}
      >
        <BellFillIcon height={24} width={24} style={{ position: "absolute", right: 20, top: 20 }} />

        <Animated.View
          style={[
            {
              width: "100%",
              alignSelf: "center",
            },
            animatedStyles,
          ]}
        >
          <MenuItem
            title="Yayoi Kusama"
            description="Ephemera or Merchandise or Print, Limited Edition"
            onPress={() => {}}
            style={{ backgroundColor: "white" }}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  )
}
