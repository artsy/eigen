import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { HomeFeedOnboardingRail_onboardingModule$data } from "__generated__/HomeFeedOnboardingRail_onboardingModule.graphql"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { switchTab } from "app/system/navigation/navigate"
import { memo, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { HomeFeedModalCarousel } from "./HomeFeedModalCarousel/HomeFeedModalCarousel"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"

interface HomeFeedOnboardingRailProps {
  title: string
  onboardingModule: HomeFeedOnboardingRail_onboardingModule$data
}

interface OnboardingDataItem {
  visible: boolean
  jsx: JSX.Element
}

export const isOnboardingVisible = (
  onboardingModule:
    | Omit<HomeFeedOnboardingRail_onboardingModule$data, " $fragmentType">
    | null
    | undefined
) => {
  return !!onboardingModule?.showMyCollectionCard || !!onboardingModule?.showSWACard
}

export const HomeFeedOnboardingRail: React.FC<HomeFeedOnboardingRailProps> = (props) => {
  const { title, onboardingModule } = props
  const { trackEvent } = useTracking()

  const [isMyCollectionModalVisible, setIsMyCollectionModalVisible] = useState(false)

  if (!isOnboardingVisible(onboardingModule)) {
    return null
  }

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
            image={require("images/homefeed-my-collection-inboarding-0.jpg")}
            buttonText="Explore My Collection"
            onPress={() => {
              setIsMyCollectionModalVisible(true)
              trackEvent(tracks.tappedExploreMyCollection())
            }}
            testID="my-collection-hf-onboadring-card-my-collection"
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
          image={require("images/homefeed-my-collection-inboarding-1.jpg")}
          buttonText="Learn more"
          onPress={() => {
            switchTab("sell")
          }}
          testID="my-collection-hf-onboadring-card-swa"
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
          return item.jsx
        }}
      />
    </>
  )
}

export const HomeFeedOnboardingRailFragmentContainer = memo(
  createFragmentContainer(HomeFeedOnboardingRail, {
    onboardingModule: graphql`
      fragment HomeFeedOnboardingRail_onboardingModule on HomePageMyCollectionOnboardingModule {
        showMyCollectionCard
        showSWACard
      }
    `,
  })
)

const tracks = {
  tappedExploreMyCollection: () => ({
    action: ActionType.tappedExploreMyCollection,
    context_screen: OwnerType.home,
    context_screen_owner_type: OwnerType.home,
    context_module: ContextModule.doMoreOnArtsy,
    destination_screen_owner_type: OwnerType.myCollectionOnboarding,
  }),
}
