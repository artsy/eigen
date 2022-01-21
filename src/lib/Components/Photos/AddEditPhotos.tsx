import { useActionSheet } from "@expo/react-native-action-sheet"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Stack } from "lib/Components/Stack"
import { Photo } from "lib/Scenes/Consignments"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { isPad } from "lib/utils/hardware"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { chunk } from "lodash"
import {
  AddIcon,
  BorderBox,
  Box,
  Button,
  Flex,
  Separator,
  Spacer,
  useColor,
  XCircleIcon,
} from "palette"
import React, { useState } from "react"
import { Image, ScrollView, TouchableOpacity } from "react-native"
import { Image as RNCImage } from "react-native-image-crop-picker"

const MARGIN = 20

interface AddEditPhotosProps {
  initialPhotos: Photo[]
  photosUpdated: (updatedPhotos: Photo[]) => void
  navigator: NavigatorIOS
}

export const AddEditPhotos: React.FC<AddEditPhotosProps> = ({
  initialPhotos,
  photosUpdated,
  navigator,
}) => {
  const [photos, setPhotos] = useState(initialPhotos)

  const { width: screenWidth } = useScreenDimensions()
  const numColumns = isPad() ? 5 : 2
  const imageSize = (screenWidth - MARGIN) / numColumns - MARGIN

  const addPhotos = (addedImages: RNCImage[]) => {
    const addedPhotos: Photo[] = addedImages.map((p) => ({ image: p, uploaded: false }))
    const allPhotos = photos.concat(addedPhotos)
    setPhotos(allPhotos)
  }

  const deletePhoto = (deletedPhoto: Photo) => {
    const updatedPhotos = photos.filter((p) => p.image.path !== deletedPhoto.image.path)
    setPhotos(updatedPhotos)
  }

  const doneTapped = () => {
    photosUpdated(photos)
    navigator.pop()
  }

  const items = [
    <AddPhotosButton addPhotos={addPhotos} key="button" imageSize={imageSize} />,
  ].concat(
    photos.map((photo, index) => {
      return (
        <Box key={index}>
          <Image
            style={{ width: imageSize, height: imageSize, resizeMode: "cover" }}
            source={{ uri: photo.image.path }}
          />
          <DeletePhotoButton photo={photo} deletePhoto={deletePhoto} />
        </Box>
      )
    })
  )
  const rows = chunk(items, numColumns)

  return (
    <>
      <FancyModalHeader onLeftButtonPress={doneTapped}>Photos</FancyModalHeader>
      <ScrollView>
        <Flex flexDirection="row" flexWrap="wrap" mt={2}>
          {rows.map((row, i) => (
            <Stack horizontal key={i} mb="2" mx="2">
              {row}
            </Stack>
          ))}
        </Flex>
      </ScrollView>
      <Separator key="separator" />
      <Spacer mb={1} />
      <Box px={2}>
        <Button block width="100%" onPress={doneTapped}>
          Done
        </Button>
      </Box>
      <Spacer mb={1} />
    </>
  )
}

const AddPhotosButton: React.FC<{
  imageSize: number
  addPhotos: (addedImages: RNCImage[]) => void
}> = ({ imageSize, addPhotos }) => {
  const color = useColor()
  const { showActionSheetWithOptions } = useActionSheet()

  return (
    <TouchableOpacity
      testID="add-photos-button"
      onPress={() => {
        showPhotoActionSheet(showActionSheetWithOptions).then((addedImages) => {
          addPhotos(addedImages)
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

const DeletePhotoButton: React.FC<{ photo: Photo; deletePhoto: (deletedPhoto: Photo) => void }> = ({
  photo,
  deletePhoto,
}) => {
  return (
    <Box position="absolute" right={-4} top={-5}>
      <TouchableOpacity
        testID={"delete-photo-button-" + photo.image.path}
        hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
        onPress={() => deletePhoto(photo)}
      >
        <XCircleIcon width={20} height={20} />
      </TouchableOpacity>
    </Box>
  )
}
