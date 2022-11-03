import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { navigate, switchTab } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"
import { Image, ImageSourcePropType } from "react-native"

interface HomeFeedOnboardingRailProps {
  title: string
  mb?: number
}

interface HomeFeedOnboardingRailItemProps {
  type: "MyC" | "SWA"
  title: string
  subtitle: string
  image: ImageSourcePropType
  button: string
}

const onboardingData = [
  {
    type: "MyC",
    title: "Manage your collection",
    subtitle: "Get powerful market insights about artworks you own.",
    image: require("images/homefeed-my-collection-inboarding-0.webp"),
    button: "Explore My Collection",
  },
  {
    type: "SWA",
    title: "Sell with Artsy ",
    subtitle: "Get the best sales options for artworks from your collection.",
    image: require("images/homefeed-my-collection-inboarding-1.webp"),
    button: "Learn more",
  },
]

export const HomeFeedOnboardingRail: React.FC<HomeFeedOnboardingRailProps> = (props) => {
  const { mb, title } = props

  return (
    <Flex mb={mb}>
      <EmbeddedCarousel
        title={title}
        data={onboardingData}
        renderItem={({ item }: { item: HomeFeedOnboardingRailItemProps }) => {
          return (
            <Flex width={295}>
              <Image source={item.image} borderTopLeftRadius={4} borderTopRightRadius={4} />
              <Flex
                p={2}
                backgroundColor="black100"
                borderBottomLeftRadius={4}
                borderBottomRightRadius={4}
              >
                <Text variant="md" mb={0.5} color="white100">
                  {item.title}
                </Text>
                <Text variant="xs" mb={2} color="white100">
                  {item.subtitle}
                </Text>
                <Button
                  size="small"
                  variant="fillLight"
                  onPress={() => {
                    switch (item.type) {
                      case "MyC":
                        return navigate("/") // TODO: navigate the the full screen carousel
                      case "SWA":
                        return switchTab("sell")
                    }
                  }}
                >
                  {item.button}
                </Button>
              </Flex>
            </Flex>
          )
        }}
      />
    </Flex>
  )
}
