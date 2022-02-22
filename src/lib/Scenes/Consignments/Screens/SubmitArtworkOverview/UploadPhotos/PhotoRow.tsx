import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { Photo } from "./validation"

interface Props {
  photo: Photo
  onPhotoDelete: (arg: Photo) => void
}

export const PhotoRow: React.FC<Props> = ({ photo, onPhotoDelete }) => {
  if (photo.loading) {
    return (
      <PhotoRowWrapper>
        <PhotoRowPlaceholder />
      </PhotoRowWrapper>
    )
  }

  return (
    <PhotoRowWrapper error={photo.error} errorMsg={photo.errorMessage}>
      <PhotoRowContent photo={photo} onPhotoDelete={onPhotoDelete} />
    </PhotoRowWrapper>
  )
}

const PhotoRowContent: React.FC<Props> = ({ photo, onPhotoDelete }) => (
  <Flex flexDirection="row">
    <Flex width="53%" justifyContent="center">
      <Image
        resizeMode="contain"
        source={{ uri: photo.path }}
        style={{ height: 58, width: 58 }}
        testID="Submission_Image"
      />
    </Flex>
    <Flex flexDirection="row" justifyContent="space-around" alignItems="center" width="47%">
      <Text>{photo.sizeDisplayValue}</Text>
      <Button
        ml={1}
        variant="text"
        size="small"
        onPress={() => onPhotoDelete(photo)}
        testID="Submission_Delete_Photo_Button"
      >
        <Text style={{ textDecorationLine: "underline" }}>Delete</Text>
      </Button>
    </Flex>
  </Flex>
)

const PhotoRowPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex flexDirection="row">
      <Flex width="55%" justifyContent="center" pt={1} pb={1}>
        <PlaceholderBox testID="Submission_Photo_Placeholder" width={58} height={58} />
      </Flex>
    </Flex>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="45%">
      <PlaceholderText width={55} height={18} />
      <PlaceholderText width={55} height={18} />
    </Flex>
  </ProvidePlaceholderContext>
)

const PhotoRowWrapper: React.FC<{ error?: boolean; errorMsg?: string }> = ({
  error,
  errorMsg,
  children,
}) => (
  <>
    <Flex
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{
        borderColor: error ? "#C82400" : "lightgray",
        borderWidth: 1,
        borderRadius: 4,
        height: 68,
      }}
    >
      {children}
    </Flex>
    {errorMsg && (
      <Text variant="xs" color="red100">
        {errorMsg}
      </Text>
    )}
    <Spacer mt={2} />
  </>
)
