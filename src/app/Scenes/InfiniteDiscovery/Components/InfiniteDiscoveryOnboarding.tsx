import {
  Button,
  Flex,
  HeartIcon,
  Spacer,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { useRef, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"

const STEPS = [
  {
    key: "introduction",
    title: (
      <Text variant="sm-display" color="black60" mb={0.5}>
        Welcome to Discover Daily
      </Text>
    ),
    description: <Text variant="lg-display">A new way of browsing works on Artsy.</Text>,
  },
  {
    key: "swipeArtworks",
    description: <Text variant="lg-display">Swipe artworks to the left to see the next work</Text>,
  },
  {
    key: "favouriteArtworks",
    description: (
      <Text variant="lg-display">
        Press <HeartIcon /> when you like an artwork you see
      </Text>
    ),
  },
]
export const InfiniteDiscoveryOnboarding: React.FC<{}> = () => {
  const space = useSpace()
  const { width } = useScreenDimensions()
  const flatlistRef = useRef<FlatList>(null)
  const [index, setIndex] = useState(0)

  const handleNext = () => {
    const newIndex = index + 1

    if (newIndex < STEPS.length) {
      setIndex(newIndex)
      flatlistRef.current?.scrollToIndex({ animated: true, index: newIndex })
    }
  }

  return (
    <Flex flex={1} backgroundColor="white100">
      <Flex flex={1}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.1)`]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: space(2) }}>
          <FlatList
            ref={flatlistRef}
            data={STEPS}
            scrollEnabled={false}
            style={{ marginHorizontal: -space(2), flexGrow: 0 }}
            renderItem={({ item }) => (
              <Flex width={width} px={2} justifyContent="flex-end">
                {item.title}
                {item.description}
              </Flex>
            )}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />

          <Spacer y={2} />

          <Flex alignItems="flex-end">
            <Button variant="outline" onPress={handleNext}>
              {index === STEPS.length - 1 ? "Done" : "Next"}
            </Button>
          </Flex>
        </SafeAreaView>
      </Flex>
    </Flex>
  )
}
