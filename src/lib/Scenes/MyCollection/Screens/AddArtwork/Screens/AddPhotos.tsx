import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { AddIcon, BorderBox, Box, color, Flex, XCircleIcon } from "palette"
import React from "react"
import { Image, ScrollView, TouchableOpacity } from "react-native"
import { Image as ImageProps } from "react-native-image-crop-picker"

export const AddArtworkAddPhotos = () => {
  const navActions = AppStore.actions.myCollection.navigation
  const formValues = AppStore.useAppState(state => state.myCollection.artwork.sessionState.formValues)
  const imageSize = useImageSize()
  const { photos } = formValues

  return (
    <ScrollView>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBack()}>
        Photos {!!photos.length && <>({photos.length})</>}
      </FancyModalHeader>

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
                    <DeletePhotoButton photo={photo} />
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
  const artworkActions = AppStore.actions.myCollection.artwork
  const imageSize = useImageSize()

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

const DeletePhotoButton: React.FC<{ photo: ImageProps }> = ({ photo }) => {
  const artworkActions = AppStore.actions.myCollection.artwork

  return (
    <Box position="absolute" right={-4} top={-5}>
      <TouchableOpacity
        hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
        onPress={() => artworkActions.removePhoto(photo)}
      >
        <XCircleIcon width={20} height={20} />
      </TouchableOpacity>
    </Box>
  )
}

const useImageSize = () => {
  const dimensions = useScreenDimensions()
  const size = Math.round((dimensions.width / 2) * 0.855)
  return size
}
