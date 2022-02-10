import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { Photo } from "./validation"

export const PhotoRow: React.FC<{
  photo: Photo
  handlePhotoDelete: (arg: Photo) => void
}> = ({ photo, handlePhotoDelete }) => {
  if (photo.loading) {
    return (
      <ProvidePlaceholderContext>
        <PhotoRowPlaceholder />
      </ProvidePlaceholderContext>
    )
  }

  return (
    <>
      <Flex
        p={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          borderColor: photo.error ? "#C82400" : "lightgray",
          borderWidth: 1,
          borderRadius: 4,
          height: 68,
        }}
      >
        <Image
          resizeMode="contain"
          source={{ uri: photo.path }}
          style={{ height: 58, width: 70 }}
          testID="Submission_Image"
        />
        <Text>{photo.sizeDisplayValue}</Text>
        <Button
          variant="text"
          size="small"
          onPress={() => handlePhotoDelete(photo)}
          testID="Submission_Delete_Photo_Button"
        >
          <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
        </Button>
      </Flex>
      {photo.errorMsg && (
        <Text variant="xs" color="red100">
          {photo.errorMsg}
        </Text>
      )}
      <Spacer mt={2} />
    </>
  )
}

export const PhotoRowPlaceholder = () => (
  <>
    <Flex
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 4, height: 68 }}
    >
      <PlaceholderBox width={65} height={58} />
      <PlaceholderText width={60} height={18} />
      <Button
        disabled
        variant="text"
        size="small"
        testID="Submission_Placeholder_Delete_Photo_Button"
      >
        <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
      </Button>
    </Flex>
    <Spacer mt={2} />
  </>
)
