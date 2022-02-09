import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { useFormikContext } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { Button, Flex, Spacer, Spinner, Text } from "palette"
import React, { useEffect } from "react"
import { Image } from "react-native"
import { uploadImageAndPassToGemini } from "../../../Submission/uploadPhotoToGemini"
import { Photo, PhotosFormModel } from "./validation"

export const UploadPhotosForm: React.FC<{ setPhotoUploadError: (arg: boolean) => void }> = ({
  setPhotoUploadError,
}) => {
  const { values, setFieldValue } = useFormikContext<PhotosFormModel>()
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { showActionSheetWithOptions } = useActionSheet()

  useEffect(() => {
    if (submission.photos.photos.length) {
      setFieldValue("photos", [...values.photos, submission.photos.photos])
    }
  }, [])

  const addPhotoToSubmission = async (photos: Photo[]) => {
    for (const photo of photos) {
      photo.loading = true
      setFieldValue("photos", [...values.photos, photo])

      if (photo.path) {
        try {
          await uploadImageAndPassToGemini(photo.path, "private", submission.submissionId)
          GlobalStore.actions.artworkSubmission.submission.setPhotos({
            photos: [...submission.photos.photos, photo],
          })

          photo.loading = false
          setFieldValue("photos", [...values.photos, photo])
        } catch (error) {
          photo.loading = false
          photo.error = true
          captureMessage(JSON.stringify(error))
        }
      }
    }
  }

  const handleAddPhotoPress = async () => {
    try {
      const photos = await showPhotoActionSheet(showActionSheetWithOptions, true)
      if (photos?.length && submission?.submissionId) {
        addPhotoToSubmission(photos)
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setPhotoUploadError(true)
    }
  }

  const handlePhotoDelete = (photo: Photo) => {
    console.log({ deleted_photo: photo })
  }

  return (
    <>
      <Flex style={{ borderColor: "lightgray", borderWidth: 1 }} mt={4} mb={2} p={2} pt={3} pb={3}>
        <Text variant="lg" color="black100" marginBottom={1}>
          Add Files Here
        </Text>
        <Text variant="md" color="black60" marginBottom={1}>
          Files Supported: JPG, PNG
        </Text>
        <Text variant="md" color="black60" marginBottom={3}>
          Total Maximum Size: 30MB
        </Text>
        <Button onPress={handleAddPhotoPress} variant="outline" size="large" block>
          Add Photo
        </Button>
        <Spacer mt={1} />
      </Flex>

      {values.photos.map((photo: Photo, idx: number) => {
        if (photo?.loading) {
          return <PhotoThumbnailLoadingState key={idx} />
        } else if (photo?.error) {
          return <PhotoThumbnailErrorState key={idx} />
        }

        return (
          <PhotoThumbnailSuccessState
            key={idx}
            photo={photo}
            handlePhotoDelete={handlePhotoDelete}
          />
        )
      })}
    </>
  )
}

const PhotoThumbnailSuccessState: React.FC<{
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

const PhotoThumbnailLoadingState = () => {
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

const PhotoThumbnailErrorState = () => {
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
