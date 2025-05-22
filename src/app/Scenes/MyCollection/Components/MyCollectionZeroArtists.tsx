import { Button, Flex, useSpace } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { ModalCarousel } from "app/Scenes/HomeView/Components/ModalCarouselComponents/ModalCarousel"
import { useZeroStateDimensions } from "app/Scenes/MyCollection/utils/zeroStateWidth"
import { RouterLink } from "app/system/navigation/RouterLink"
import { isFontScaleLarge } from "app/utils/accessibility"
import { useState } from "react"
import { Image } from "react-native"

export const MyCollectionZeroArtists: React.FC<{}> = () => {
  const space = useSpace()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { width: zeroStateWidth } = useZeroStateDimensions()

  return (
    <Flex>
      <ModalCarousel
        isVisible={isModalVisible}
        toggleModal={(isVisible) => setIsModalVisible(isVisible)}
      />
      <ZeroState
        minHeight={0}
        showBorder
        bigTitle="Keep track of artists you collect"
        subtitle="Discover more about the artists you collect, with latest career news and auction results."
        image={
          <Image
            source={require("images/my-collection-artists-empty-state.webp")}
            resizeMode="cover"
            style={{
              width: zeroStateWidth,
              minHeight: 150,
              marginTop: space(2),
            }}
          />
        }
        callToAction={
          <Flex
            gap={2}
            flexDirection={isFontScaleLarge() ? "column" : "row"}
            justifyContent="space-evenly"
          >
            <RouterLink
              to="/my-collection/collected-artists/new"
              onPress={() => {
                // TODO: Implement analytics
              }}
              hasChildTouchable
            >
              <Button testID="add-artwork-button-zero-state" block={isFontScaleLarge()}>
                Add Artists
              </Button>
            </RouterLink>
            <Button
              variant="outline"
              onPress={() => {
                setIsModalVisible(true)
              }}
              block={isFontScaleLarge()}
            >
              Learn More
            </Button>
          </Flex>
        }
      />
    </Flex>
  )
}
