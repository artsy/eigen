import { ArtworkIcon, Flex, GraphIcon, IconProps, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ModalCarouselContainer } from "./ModalCarouselContainer"
import { ModalCarouselScreenWrapper } from "./ModalCarouselScreenWrapper"

interface ModalCarouselProps {
  isVisible: boolean
  toggleModal: (isVisible: boolean) => void
}

export const ModalCarousel: React.FC<ModalCarouselProps> = ({ isVisible, toggleModal }) => {
  return (
    <Flex flex={1}>
      <ModalCarouselContainer isVisible={isVisible} toggleModal={toggleModal}>
        <ModalCarouselScreenWrapper
          title="Create a private record of your artworks"
          description="Manage your collection online easily and securely in one place."
          imgSrc={require("images/myCollection-onboarding-image-1.webp")}
        />
        <ModalCarouselScreenWrapper
          title="Get insights on your collection"
          description="Track market demand and get insights into the market value of artworks in your collection."
          imgSrc={require("images/my-collection-onboarding-image-2.webp")}
        />
        <ModalCarouselScreenWrapper
          title="Keep track of artists you collect"
          description="Discover more about the artists you collect, with latest career news and auction results."
          imgSrc={require("images/my-collection-onboarding-image-3.webp")}
        />
        <ModalCarouselScreenWrapper
          title="Build your reputation with galleries"
          description="Share artists you collect to help galleries get to know your interests and collector profile."
          imgSrc={require("images/myCollection-onboarding-image-4.webp")}
        />
        <ModalCarouselScreenWrapper title="How it works" description={<HowItWorksScreenNew />} />
      </ModalCarouselContainer>
    </Flex>
  )
}

const HowItWorksScreenNew = () => {
  return (
    <Flex mt={4}>
      <Join separator={<Spacer y={2} />}>
        <Slide
          title="Add artists and artworks you collect"
          text="Add them directly from Artsy entries or upload your own images and details."
          icon={ArtworkIcon}
        />
        <Slide
          title="Check for insights"
          text="Get free insights into the markets and careers of the artists in your collection."
          icon={GraphIcon}
        />
      </Join>
    </Flex>
  )
}

interface SlideProps {
  icon: React.FC<IconProps>
  title: string
  text: string
}

export const Slide: React.FC<SlideProps> = ({ icon: Icon, text, title }) => {
  return (
    <Flex flexDirection="row">
      <Flex pr={1} mr={0.5} style={{ paddingTop: 6 }}>
        <Icon width={18} height={18} />
      </Flex>

      <Flex flex={1}>
        <Text variant="sm-display">{title}</Text>
        <Spacer y={0.5} />
        <Text variant="sm" color="mono60">
          {text}
        </Text>
      </Flex>
    </Flex>
  )
}
