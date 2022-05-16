import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader as NavHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Stack } from "app/Components/Stack"
import { Image as ImageProps } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { GlobalStore } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { chunk } from "lodash"
import { AddIcon, BorderBox, Box, Flex, useColor, XCircleIcon } from "palette"
import React from "react"
import { Image, ScrollView, TouchableOpacity } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

const MARGIN = 20

export const MyCollectionAddPhotos: React.FC<StackScreenProps<ArtworkFormScreen, "AddPhotos">> = ({
  navigation,
}) => {
  const formValues = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState.formValues
  )
  const { photos } = formValues
  const { width: screenWidth } = useScreenDimensions()
  const numColumns = isPad() ? 5 : 2
  const imageSize = (screenWidth - MARGIN) / numColumns - MARGIN
  const items = [<AddPhotosButton key="button" imageSize={imageSize} />].concat(
    photos.map((photo, index) => {
      return (
        <Box key={index}>
          <Image
            style={{ width: imageSize, height: imageSize, resizeMode: "cover" }}
            source={{ uri: photo.imageURL?.replace(":version", "medium") || photo.path }}
          />
          <DeletePhotoButton photo={photo} />
        </Box>
      )
    })
  )
  const rows = chunk(items, numColumns)

  return (
    <>
      <NavHeader onLeftButtonPress={navigation.goBack}>
        Photos {!!photos.length && `(${photos.length})`}
      </NavHeader>
      <ScrollView>
        <Flex flexDirection="row" flexWrap="wrap" my="2">
          {rows.map((row, i) => (
            <Stack horizontal key={i} mb="2" mx="2">
              {row}
            </Stack>
          ))}
        </Flex>
      </ScrollView>
    </>
  )
}

const AddPhotosButton: React.FC<{ imageSize: number }> = ({ imageSize }) => {
  const color = useColor()
  const artworkActions = GlobalStore.actions.myCollection.artwork
  const { showActionSheetWithOptions } = useActionSheet()

  return (
    <TouchableOpacity
      onPress={() => {
        showPhotoActionSheet(showActionSheetWithOptions, true).then((images) => {
          artworkActions.addPhotos(images)
        })
      }}
    >
      <BorderBox
        p={0}
        bg={color("white100")}
        width={imageSize}
        height={imageSize}
        key="addMorePhotos"
      >
        <Flex flex={1} flexDirection="row" justifyContent="center" alignItems="center">
          <AddIcon width={30} height={30} />
        </Flex>
      </BorderBox>
    </TouchableOpacity>
  )
}

const DeletePhotoButton: React.FC<{ photo: ImageProps }> = ({ photo }) => {
  const artworkActions = GlobalStore.actions.myCollection.artwork

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

export const tests = {
  AddPhotosButton,
  DeletePhotoButton,
}
