import { AddIcon, BorderBox, Box, color, Flex, XCircleIcon } from "@artsy/palette"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions, useStoreState } from "lib/Scenes/Consignments/v2/State/hooks"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { Image, ScrollView, TouchableOpacity } from "react-native"

export const MyCollectionAddArtworkAddPhotos = () => {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const navActions = useStoreActions(actions => actions.navigation)
  const formValues = useStoreState(state => state.artwork.formValues)
  const imageSize = useImageSize()
  const { photos } = formValues

  return (
    <ScrollView>
      <FancyModalHeader onBackPress={() => navActions.goBack()}>Photos</FancyModalHeader>

      <Flex mt={2}>
        <ScreenMargin>
          <Flex flexDirection="row" flexWrap="wrap">
            <AddPhotosButton />

            {photos.map((photo, index) => {
              return (
                <Box key={index}>
                  <Box m={0.5}>
                    <Image
                      style={{ width: imageSize, height: imageSize, resizeMode: "cover" }}
                      source={{ uri: photo.path }}
                    />
                  </Box>
                  <Box position="absolute" right={-4} top={-5}>
                    <TouchableOpacity
                      hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
                      onPress={() => artworkActions.removePhoto(photo)}
                    >
                      <XCircleIcon width={20} height={20} />
                    </TouchableOpacity>
                  </Box>
                </Box>
              )
            })}
          </Flex>
        </ScreenMargin>
      </Flex>
    </ScrollView>
  )
}

const AddPhotosButton: React.FC = () => {
  const imageSize = useImageSize()
  const artworkActions = useStoreActions(actions => actions.artwork)

  return (
    <TouchableOpacity onPress={() => artworkActions.takeOrPickPhotos()}>
      <BorderBox m={0.5} p={0} bg={color("white100")} width={imageSize} height={imageSize} key="addMorePhotos">
        <Flex flex={1} flexDirection="row" justifyContent="center" alignItems="center">
          <AddIcon width={30} height={30} />
        </Flex>
      </BorderBox>
    </TouchableOpacity>
  )
}

const useImageSize = () => {
  const dimensions = useScreenDimensions()
  const size = Math.round((dimensions.width / 2) * 0.855)
  return size
}
