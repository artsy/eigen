import { Spacer, GraphIcon, ArtworkIcon, Flex, Join } from "@artsy/palette-mobile"
import { PhoneIcon } from "app/Components/Icons/HomeFeedOnboarding/PhoneIcon"
import { SellWithEaseIcon } from "app/Components/Icons/HomeFeedOnboarding/SellWithEaseIcon"
import { StepWithImage } from "app/Components/StepWithImage/StepWithImage"
import { HomeFeedModalCarouselContainer } from "./HomeFeedModalCarouselContainer"
import { HomeFeedModalCarouselScreenWrapper } from "./HomeFeedModalCarouselScreenWrapper"

interface HomeFeedModalCarouselProps {
  isVisible: boolean
  toggleModal: (isVisible: boolean) => void
}

export const HomeFeedModalCarousel: React.FC<HomeFeedModalCarouselProps> = ({
  isVisible,
  toggleModal,
}) => {
  return (
    <Flex flex={1}>
      <HomeFeedModalCarouselContainer isVisible={isVisible} toggleModal={toggleModal}>
        <HomeFeedModalCarouselScreenWrapper
          title="Create a private record of your artworks"
          description="Manage your collection online easily and securely in one place."
          imgSrc={require("images/my-collection-onboarding-image-1.webp")}
        />
        <HomeFeedModalCarouselScreenWrapper
          title="Get insights on your collection"
          description="Track market demand and get insights into the market value of artworks in your collection."
          imgSrc={require("images/my-collection-onboarding-image-2.webp")}
        />
        <HomeFeedModalCarouselScreenWrapper
          title="Keep track of artists you collect"
          description="Discover more about the artists you collect, with latest career news and auction results."
          imgSrc={require("images/my-collection-onboarding-image-3.webp")}
        />
        <HomeFeedModalCarouselScreenWrapper
          title="How it works"
          description={<HowItWorksScreen />}
        />
      </HomeFeedModalCarouselContainer>
    </Flex>
  )
}

const HowItWorksScreen = () => {
  return (
    <Flex mt={4}>
      <Join separator={<Spacer y={2} />}>
        <StepWithImage
          title="Add your artworks"
          text="Upload images and details about your artworks to your private space."
          icon={ArtworkIcon}
        />
        <StepWithImage
          title="Check for insights"
          text="Get free insights into the markets and careers of the artists in your collection."
          icon={GraphIcon}
        />
        <StepWithImage
          title="Sell with Ease"
          text="Access free price estimates and sales options from our experts on eligible artworks."
          icon={SellWithEaseIcon}
        />
        <StepWithImage
          title="Access your collection on-the-go"
          text="Carry your collection in your pocket, wherever you go."
          icon={PhoneIcon}
        />
      </Join>
    </Flex>
  )
}
