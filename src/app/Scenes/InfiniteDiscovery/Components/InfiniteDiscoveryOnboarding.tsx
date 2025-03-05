import {
  Button,
  Flex,
  HeartIcon,
  Spacer,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useRef, useState } from "react"
import { Modal } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"

export const InfiniteDiscoveryOnboarding: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false)

  const hasInteractedWithOnboarding = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.hasInteractedWithOnboarding
  )

  console.log({ hasInteractedWithOnboarding })
  useEffect(() => {
    setTimeout(() => {
      if (!hasInteractedWithOnboarding) {
        setIsVisible(true)
      }
    }, 2000)
  }, [hasInteractedWithOnboarding])

  const space = useSpace()
  const { width } = useScreenDimensions()
  const flatlistRef = useRef<FlatList>(null)
  const [index, setIndex] = useState(0)

  const handleNext = () => {
    const newIndex = index + 1

    if (newIndex < STEPS.length) {
      setIndex(newIndex)
      flatlistRef.current?.scrollToIndex({ animated: true, index: newIndex })
    } else {
      setIsVisible(false)
    }
  }

  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <Flex flex={1} backgroundColor="transparent">
        <Flex flex={1}>
          <LinearGradient
            colors={["rgb(255, 255, 255)", `rgba(231, 231, 231, 0.9)`]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          />
          <SafeAreaView
            style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "transparent" }}
          >
            <Flex
              flex={1}
              width="100%"
              backgroundColor="black15"
              alignSelf="center"
              justifyContent="center"
              alignItems="center"
              opacity={0.7}
            ></Flex>
            <Flex justifyContent="flex-end" px={2}>
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
            </Flex>
          </SafeAreaView>
        </Flex>
      </Flex>
    </Modal>
  )
}

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
        Press <HeartIcon height={24} width={24} /> when you like an artwork you see
      </Text>
    ),
  },
]
