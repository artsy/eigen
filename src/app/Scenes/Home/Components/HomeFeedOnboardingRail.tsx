import { HomeFeedOnboardingRail_onboardingModule$data } from "__generated__/HomeFeedOnboardingRail_onboardingModule.graphql"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { switchTab } from "app/navigation/navigate"
import { Flex } from "palette"
import React, { useState } from "react"
import { ImageSourcePropType } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { HomeFeedModalCarousel } from "./HomeFeedModalCarousel/HomeFeedModalCarousel"
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

interface OnboardingDataItem {
  visible: boolean
  jsx: JSX.Element
}

export const HomeFeedOnboardingRail: React.FC<HomeFeedOnboardingRailProps> = (props) => {
  const { mb, title, onboardingModule } = props

  const [isMyCollectionModalVisible, setIsMyCollectionModalVisible] = useState(false)
  const onboardingCardsData: OnboardingDataItem[] = [
    {
      visible: onboardingModule.showMyCollectionCard,
      jsx: (
        <>
          <HomeFeedModalCarousel
            isVisible={isMyCollectionModalVisible}
            toggleModal={(isVisible) => setIsMyCollectionModalVisible(isVisible)}
          />
          <HomeFeedOnboardingCard
            title="Manage your collection"
            subtitle="Get powerful market insights about artworks you own."
            image={require("images/homefeed-my-collection-inboarding-0.webp")}
            buttonText="Explore My Collection"
            onPress={() => {
              setIsMyCollectionModalVisible(true)
            }}
          />
        </>
      ),
    },
    {
      visible: onboardingModule.showSWACard,
      jsx: (
        <HomeFeedOnboardingCard
          title="Sell with Artsy"
          subtitle="Get the best sales options for artworks from your collection."
          image={require("images/homefeed-my-collection-inboarding-1.webp")}
          buttonText="Learn more"
          onPress={() => {
            switchTab("sell")
          }}
        />
      ),
    },
  ]

  const visibleOnboardingCardsData = onboardingCardsData.filter((item) => item.visible)

  return (
    <>
      <EmbeddedCarousel
        testID="my-collection-hf-onboadring-rail"
        title={title}
        data={visibleOnboardingCardsData}
        renderItem={({ item }: { item: OnboardingDataItem }) => {
          return <Flex mb={mb}>{item.jsx}</Flex>
        }}
      />
    </>
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
