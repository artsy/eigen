import { HomeFeedOnboardingRail_onboardingModule$data } from "__generated__/HomeFeedOnboardingRail_onboardingModule.graphql"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { Flex } from "palette"
import React from "react"
import { ImageSourcePropType } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"

interface HomeFeedOnboardingRailProps {
  title: string
  mb?: number
  onboardingModule: HomeFeedOnboardingRail_onboardingModule$data
}

export interface HomeFeedOnboardingRailItemProps {
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

  const cardsToShow = onboardingData.filter((item) => item.shouldShow)
  if (!cardsToShow.length) {
    return <></>
  }

  return (
    <Flex mb={mb} mx={2}>
      <EmbeddedCarousel
        testID="my-collection-hf-onboadring"
        title={title}
        data={onboardingData}
        renderItem={({ item }: { item: HomeFeedOnboardingRailItemProps }) => {
          return <HomeFeedOnboardingCard item={item} />
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
