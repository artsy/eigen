import { Spacer, GraphIcon, ArtworkIcon, Flex, Join } from "@artsy/palette-mobile"
import { PhoneIcon } from "app/Components/Icons/HomeFeedOnboarding/PhoneIcon"
import { SellWithEaseIcon } from "app/Components/Icons/HomeFeedOnboarding/SellWithEaseIcon"
import { StepWithImage } from "app/Components/StepWithImage/StepWithImage"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
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
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")

  // TODO: add new images, confirm coopy, change buttons on the last screen + rename components
  return (
    <Flex flex={1}>
      {!!enableCollectedArtists ? (
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
            title="Build your reputation with galleries"
            description="Share artists you collect to help galleries get to know your interests and collector profile."
            imgSrc={require("images/my-collection-onboarding-image-3.webp")}
          />
          <HomeFeedModalCarouselScreenWrapper
            title="How it works"
            description={<HowItWorksScreenNew />}
          />
        </HomeFeedModalCarouselContainer>
      ) : (
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
      )}
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

const HowItWorksScreenNew = () => {
  return (
    <Flex mt={4}>
      <Join separator={<Spacer y={2} />}>
        <StepWithImage
          title="Add artists and artworks you collect"
          text="Add them directly from Artsy entries or upload your own images and details."
          icon={ArtworkIcon}
        />
        <StepWithImage
          title="Check for insights"
          text="Get free insights into the markets and careers of the artists in your collection."
          icon={GraphIcon}
        />
        <StepWithImage
          title="Request a Price Estimate"
          text="On eligible works, request an estimate from our specialists."
          icon={SellWithEaseIcon}
        />
        <StepWithImage
          title="Sell with Ease"
          text="Access free price estimates and sales options from our experts on eligible artworks."
          icon={SellWithEaseIcon}
        />
      </Join>
    </Flex>
  )
}
