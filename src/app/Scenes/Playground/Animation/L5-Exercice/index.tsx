import { BellFillIcon, Flex, Separator, Text, useColor } from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { ScrollView, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

export const Exercice: React.FC<{}> = () => {
  const color = useColor()

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
          <MenuItem
            title="Yayoi Kusama"
            description="Ephemera or Merchandise or Print, Limited Edition"
            onPress={() => {}}
            noFeedback
            style={{ backgroundColor: color("mono0") }}
          />
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
      pressed.set(() => true)
    })
    .onChange((event) => {
      offset.set(() => event.translationX)
    })
    .onFinalize(() => {
      offset.set(() => withTiming(0))
      pressed.set(() => false)
    })

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: pressed.get() ? "red" : "violet",
    transform: [{ translateX: offset.value }, { scale: withTiming(pressed.get() ? 1.2 : 1) }],
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

const THRESHOLD = 50

const Solution2 = () => {
  const color = useColor()
  const dragX = useSharedValue(0)
  const isIconVisible = useSharedValue(false)

  const tap = Gesture.Pan()
    .onStart(() => {})
    .onChange((event) => {
      dragX.set(() => (!isIconVisible.get() ? event.translationX : event.translationX - THRESHOLD))
    })
    .onFinalize(() => {
      if (dragX.get() < -THRESHOLD) {
        dragX.set(() => withSpring(-THRESHOLD))
        isIconVisible.value = true
      } else {
        dragX.set(() => withSpring(0))
        isIconVisible.set(() => false)
      }
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: dragX.get(),
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
            noFeedback
            style={{ backgroundColor: color("mono0") }}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  )
}
