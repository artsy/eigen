import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { Photo } from "./validation"

export const PhotoThumbnailSuccessState: React.FC<{
  photo: Photo
  handlePhotoDelete: (arg: Photo) => void
}> = ({ photo, handlePhotoDelete }) => (
  <>
    <Flex
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 4, height: 68 }}
    >
      <Image
        resizeMode="contain"
        source={{ uri: photo.path }}
        style={{ height: 58, width: 70 }}
        testID="Submission_image"
      />
      <Text>{photo.sizeDisplayValue}</Text>
      <Button variant="text" size="small" onPress={() => handlePhotoDelete(photo)}>
        <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
      </Button>
    </Flex>
    <Spacer mt={2} />
  </>
)

export const PhotoThumbnailLoadingState = () => (
  <ProvidePlaceholderContext>
    <Flex
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 4, height: 68 }}
    >
      <PlaceholderBox width={65} height={58} />
      <PlaceholderText width={60} height={18} />
      <Button disabled variant="text" size="small">
        <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
      </Button>
    </Flex>
    <Spacer mt={2} />
  </ProvidePlaceholderContext>
)

export const PhotoThumbnailErrorState: React.FC<{
  photo: Photo
  handlePhotoDelete: (arg: Photo) => void
}> = ({ photo, handlePhotoDelete }) => (
  <>
    <Flex
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ borderColor: "red", borderWidth: 1, borderRadius: 4, height: 68 }}
    >
      <Image
        resizeMode="contain"
        // TODO: get uril from photo
        source={{
          uri: "https://i.picsum.photos/id/14/200/300.jpg?hmac=FMdb1SH_oeEo4ibDe66-ORzb8p0VYJUS3xWfN3h2qDU",
        }}
        style={{ height: 58, width: 70 }}
        testID="Submission_image"
      />
      <Text>{photo.sizeDisplayValue}</Text>
      <Button variant="text" size="small" onPress={() => handlePhotoDelete(photo)}>
        <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
      </Button>
    </Flex>
    <Text variant="xs" color="red100">
      {photo.errorMsg}
    </Text>
    <Spacer mt={2} />
  </>
)
