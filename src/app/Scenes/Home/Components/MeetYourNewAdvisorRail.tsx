import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { HomeFeedOnboardingCard } from "./HomeFeedOnboardingCard"

interface MeetYourNewAdvisorRailProps {
  title: string
}

interface OnboardingDataItem {
  jsx: JSX.Element
}

export const MeetYourNewAdvisorRail: React.FC<MeetYourNewAdvisorRailProps> = (props) => {
  const { title } = props

  const onboardingCardsData: OnboardingDataItem[] = [
    {
      jsx: (
        <HomeFeedOnboardingCard
          title="Get the art you want"
          subtitle="All the world’s in-demand art, and tools to get exactly what you’re looking for."
          image={require("images/homefeed-my-collection-inboarding-1.jpg")}
          //          image={require("images/meet-your-new-art-advisor-0.png")}
          buttonText="Explore Works"
          onPress={() => {
            return
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
          image={require("images/meet-your-new-art-advisor-1.png")}
          buttonText="Start Searching"
          onPress={() => {
            return
          }}
          testID="meet-your-new-advisor-card-1"
        />
      ),
    },
    {
      jsx: (
        <HomeFeedOnboardingCard
          title="Know your collection better"
          subtitle="See all the artworks you own, on your phone—and keep up with artists’ markets."
          image={require("images/meet-your-new-art-advisor-2.png")}
          buttonText="View My Collection"
          onPress={() => {
            return
          }}
          testID="meet-your-new-advisor-card-2"
        />
      ),
    },
    {
      jsx: (
        <HomeFeedOnboardingCard
          title="Sell from your collection"
          subtitle="When you’re ready to sell, earn more and worry less with our expert help."
          image={require("images/meet-your-new-art-advisor-3.png")}
          buttonText="Learn more"
          onPress={() => {
            return
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
