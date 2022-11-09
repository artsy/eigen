import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { Flex } from "palette"
import React from "react"
import { ImageSourcePropType } from "react-native"
// import { createFragmentContainer, graphql } from "react-relay"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"

interface HomeFeedOnboardingRailProps {
  title: string
  mb?: number
  onboardingModuleData: HomeFeedOnboardingRailItemProps[] | []
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
  const { mb, title, onboardingModuleData } = props

  return (
    <Flex mb={mb} mx={2}>
      <EmbeddedCarousel
        testID="my-collection-hf-onboadring-rail"
        title={title}
        data={onboardingModuleData}
        renderItem={({ item }: { item: HomeFeedOnboardingRailItemProps }) => {
          return <HomeFeedOnboardingCard item={item} />
        }}
      />
    </Flex>
  )
}
