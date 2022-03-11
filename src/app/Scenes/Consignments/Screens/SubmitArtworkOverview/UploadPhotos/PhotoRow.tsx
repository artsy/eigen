import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
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
        style={{ height: 48, width: 48 }}
        resizeMode="cover"
        source={{ uri: photo.path }}
        testID="Submission_Image"
      />
    </Flex>
    <Flex flexDirection="row" justifyContent="space-around" alignItems="center" width="47%">
      <Text style={{ width: 58 }}>{photo.sizeDisplayValue}</Text>
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
      <Flex width="52%" justifyContent="center">
        <PlaceholderBox testID="Submission_Photo_Placeholder" width={48} height={48} />
      </Flex>
      <Flex flexDirection="row" width="47%" alignItems="center" justifyContent="space-around">
        <PlaceholderText width={50} height={18} marginBottom={0} />
        <PlaceholderText width={50} height={18} marginBottom={0} />
      </Flex>
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
    {error && errorMsg && (
      <Text variant="xs" color="red100">
        {errorMsg}
      </Text>
    )}
    <Spacer mt={2} />
  </>
)
