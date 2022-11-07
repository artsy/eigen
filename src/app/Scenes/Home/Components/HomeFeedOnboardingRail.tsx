import { HomeFeedOnboardingRail_onboardingModule$data } from "__generated__/HomeFeedOnboardingRail_onboardingModule.graphql"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { navigate, switchTab } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"
import { Image, ImageSourcePropType } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface HomeFeedOnboardingRailProps {
  title: string
  mb?: number
  onboardingModule: HomeFeedOnboardingRail_onboardingModule$data
}

interface HomeFeedOnboardingRailItemProps {
  shouldShow: boolean
  type: "MyC" | "SWA"
  title: string
  subtitle: string
  image: ImageSourcePropType
  button: string
}

export const HomeFeedOnboardingRail: React.FC<HomeFeedOnboardingRailProps> = (props) => {
  const { mb, title, onboardingModule } = props

  const onboardingData = [
    {
      shouldShow: onboardingModule.showMyCollectionCard,
      type: "MyC",
      title: "Manage your collection",
      subtitle: "Get powerful market insights about artworks you own.",
      image: require("images/homefeed-my-collection-inboarding-0.webp"),
      button: "Explore My Collection",
    },
    {
      shouldShow: onboardingModule.showSWACard,
      type: "SWA",
      title: "Sell with Artsy ",
      subtitle: "Get the best sales options for artworks from your collection.",
      image: require("images/homefeed-my-collection-inboarding-1.webp"),
      button: "Learn more",
    },
  ]

  return (
    <Flex mb={mb} mx={2}>
      <EmbeddedCarousel
        testID="my-collection-hf-onboadring"
        title={title}
        data={onboardingData}
        renderItem={({ item }: { item: HomeFeedOnboardingRailItemProps }) => {
          if (!item.shouldShow) {
            return <></>
          }
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

export const HomeFeedOnboardingRailFragmentContainer = createFragmentContainer(
  HomeFeedOnboardingRail,
  {
    onboardingModule: graphql`
      fragment HomeFeedOnboardingRail_onboardingModule on HomePageMyCollectionOnboardingModule {
        showMyCollectionCard
        showSWACard
      }
    `,
  }
)
