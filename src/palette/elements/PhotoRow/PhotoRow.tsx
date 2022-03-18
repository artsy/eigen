import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { PlaceholderBox } from "app/utils/placeholders"
import { Button, Flex, ProgressBar, Spacer, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { Photo } from "./validation"

interface Props {
  photo: Photo
  onPhotoDelete: (arg: Photo) => void
  error?: boolean
  errorMsg?: string
  children?: React.FC
}

const PhotoRowContainer: React.FC<{ error?: boolean; errorMsg?: string }> = ({
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

const PhotoRowPlaceholder = ({ progress = 0.6 }: { progress?: number }) => (
  <PhotoRowContainer>
    <ProvidePlaceholderContext>
      <Flex flexDirection="row">
        <Flex width="18%" justifyContent="center">
          <PlaceholderBox testID="Submission_Photo_Placeholder" width={48} height={48} />
        </Flex>
        <Flex
          flexDirection="row"
          width="80%"
          alignItems="center"
          justifyContent="space-around"
          marginLeft={0.5}
        >
          <ProgressBar progress={progress} />
        </Flex>
      </Flex>
    </ProvidePlaceholderContext>
  </PhotoRowContainer>
)

const PhotoRowContent: React.FC<Props> = ({ photo, onPhotoDelete }) => (
  <PhotoRowContainer>
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
  </PhotoRowContainer>
)

export const PhotoRow: React.FC<Props> = ({ photo, onPhotoDelete }) => {
  if (photo.loading) {
    return <PhotoRowPlaceholder />
  }

  return (
    <PhotoRowContent
      photo={photo}
      onPhotoDelete={onPhotoDelete}
      error={photo.error}
      errorMsg={photo.errorMessage}
    />
  )
}
