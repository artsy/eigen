import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { HomeFeedModalCarousel } from "app/Scenes/Home/Components/HomeFeedModalCarousel/HomeFeedModalCarousel"
import { navigate, switchTab } from "app/system/navigation/navigate"
import { useState } from "react"
import { useTracking } from "react-tracking"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"

interface MeetYourNewAdvisorRailProps {
  title: string
}

interface OnboardingDataItem {
  jsx: JSX.Element
}

export const MeetYourNewAdvisorRail: React.FC<MeetYourNewAdvisorRailProps> = (props) => {
  const { title } = props
  const { trackEvent } = useTracking()
  const [isMyCollectionModalVisible, setIsMyCollectionModalVisible] = useState(false)

  const onboardingCardsData: OnboardingDataItem[] = [
    {
      jsx: (
        <HomeFeedOnboardingCard
          title="Find the art you love"
          subtitle="Discover the tools you need to collect artworks that fit your taste."
          image={require("images/meet-your-new-art-advisor-0.jpg")}
          buttonText="Explore Works"
          onPress={() => {
            navigate("/find-the-art-you-love")
            trackEvent(tracks.tappedProductCapabilities(ContextModule.findTheArtYouWant))
          }}
          testID="meet-your-new-advisor-card-0"
        />
      ),
    },
    {
      jsx: (
        <HomeFeedOnboardingCard
          title="Free auction results"
          subtitle="Wondering what to bid? Check the Artsy Price Database for free art market data."
          image={require("images/meet-your-new-art-advisor-1.jpg")}
          buttonText="Start Searching"
          onPress={() => {
            navigate("/price-database")
            trackEvent(tracks.tappedProductCapabilities(ContextModule.priceDatabase))
          }}
          testID="meet-your-new-advisor-card-1"
        />
      ),
    },
    {
      jsx: (
        <>
          <HomeFeedModalCarousel
            isVisible={isMyCollectionModalVisible}
            toggleModal={(isVisible) => setIsMyCollectionModalVisible(isVisible)}
          />
          <HomeFeedOnboardingCard
            title="Know your collection better"
            subtitle="See all the artworks you own, on your phone—and keep up with artists’ markets."
            image={require("images/meet-your-new-art-advisor-2.jpg")}
            buttonText="View My Collection"
            onPress={() => {
              setIsMyCollectionModalVisible(true)
              trackEvent(tracks.tappedProductCapabilities(ContextModule.myCollection))
            }}
            testID="meet-your-new-advisor-card-2"
          />
        </>
      ),
    },
    {
      jsx: (
        <HomeFeedOnboardingCard
          title="Sell from your collection"
          subtitle="When you’re ready to sell, earn more and worry less with our expert help."
          image={require("images/meet-your-new-art-advisor-3.jpg")}
          buttonText="Learn more"
          onPress={() => {
            switchTab("sell")
            trackEvent(tracks.tappedProductCapabilities(ContextModule.sell))
          }}
          testID="meet-your-new-advisor-card-3"
        />
      ),
    },
  ]

  return (
    <>
      <EmbeddedCarousel
        testID="meet-your-new-advisor-rail"
        title={title}
        data={onboardingCardsData}
        renderItem={({ item }: { item: OnboardingDataItem }) => {
          return item.jsx
        }}
      />
    </>
  )
}

const tracks = {
  tappedProductCapabilities: (contextModule: ContextModule) => ({
    action: ActionType.tappedProductCapabilitiesGroup,
    context_screen: OwnerType.home,
    context_screen_owner_type: OwnerType.home,
    context_module: contextModule,
  }),
}
