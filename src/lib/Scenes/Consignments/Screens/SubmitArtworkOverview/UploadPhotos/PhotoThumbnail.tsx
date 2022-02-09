import { Button, Flex, Spacer, Spinner, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { Photo } from "./validation"

export const PhotoThumbnailSuccessState: React.FC<{
  photo: Photo
  handlePhotoDelete: (arg: Photo) => void
}> = ({ photo, handlePhotoDelete }) => {
  return (
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
          // TODO: get uril from photo
          source={{
            uri: "https://i.picsum.photos/id/14/200/300.jpg?hmac=FMdb1SH_oeEo4ibDe66-ORzb8p0VYJUS3xWfN3h2qDU",
          }}
          style={{ height: 58, width: 70 }}
          // TODO
          testID="image"
        />
        {/* TODO: actual size */}
        <Text>0.32mb</Text>
        <Button variant="text" size="small" onPress={() => handlePhotoDelete(photo)}>
          <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
        </Button>
      </Flex>
      <Spacer mt={2} />
    </>
  )
}

export const PhotoThumbnailLoadingState = () => {
  return (
    <>
      <Flex
        p={1}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 4, height: 68 }}
      >
        <Spinner color="black60" />
      </Flex>
      <Spacer mt={2} />
    </>
  )
}

export const PhotoThumbnailErrorState = () => {
  return (
    <>
      <Flex
        p={1}
        alignItems="center"
        style={{ borderColor: "red", borderWidth: 1, borderRadius: 4, height: 68 }}
      >
        <Text color="black60">Problem</Text>
      </Flex>
      <Spacer mt={2} />
    </>
  )
}
