import { Formik } from "formik"
import { BulletedItem, Button, CTAButton, Flex, Spacer, Spinner, Text } from "palette"
import React, { useState } from "react"
import { Image } from "react-native"
import { ErrorView } from "../Components/ErrorView"
import { UploadPhotosForm } from "./UploadPhotosForm"
import {
  Photo,
  photosEmptyInitialValues,
  PhotosFormModel,
  photosValidationSchema,
} from "./validation"

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const [photoUploadError, setPhotoUploadError] = useState(false)

  if (photoUploadError) {
    return <ErrorView />
  }

  const handlePhotoDelete = (photo: Photo) => {
    console.log({ deleted_photo: photo })
  }

  return (
    <Flex p={1} mt={1}>
      <Flex>
        <BulletedItem>
          To evaluate your submission faster, please upload high-quality photos of the work's front
          and back.
        </BulletedItem>
        <BulletedItem>
          If possible, include photos of any signatures or certificates of authenticity.
        </BulletedItem>
      </Flex>

      <Formik<PhotosFormModel>
        initialValues={photosEmptyInitialValues}
        onSubmit={handlePress}
        validationSchema={photosValidationSchema}
        validateOnMount
      >
        {({ values, isValid }) => {
          const isAnyPhotoLoading = values.photos.some((photo: Photo) => photo.loading)

          return (
            <>
              <UploadPhotosForm setPhotoUploadError={setPhotoUploadError} />
              <Spacer mt={2} />
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
              <CTAButton
                disabled={!isValid || isAnyPhotoLoading}
                onPress={handlePress}
                testID="Submission_Photos_Button"
              >
                Save & Continue
                {!!isAnyPhotoLoading && <Spinner color="black60" />}
              </CTAButton>
            </>
          )
        }}
      </Formik>
    </Flex>
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
