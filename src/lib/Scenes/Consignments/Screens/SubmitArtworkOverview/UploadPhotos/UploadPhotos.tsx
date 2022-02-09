import { Formik } from "formik"
import { BulletedItem, Button, CTAButton, Flex, Spacer, Text } from "palette"
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
          return (
            <>
              <UploadPhotosForm setPhotoUploadError={setPhotoUploadError} />
              <Spacer mt={2} />
              {values.photos.map((photo: Photo, idx: number) => (
                <PhotoThumbnail key={idx} photo={photo} handlePhotoDelete={handlePhotoDelete} />
              ))}

              {/* TODO: add loading view */}
              <CTAButton
                disabled={!isValid}
                onPress={handlePress}
                testID="Submission_Photos_Button"
              >
                Save & Continue
              </CTAButton>
            </>
          )
        }}
      </Formik>
    </Flex>
  )
}

const PhotoThumbnail: React.FC<{ photo: Photo; handlePhotoDelete: (arg: Photo) => void }> = ({
  photo,
  handlePhotoDelete,
}) => {
  // TODO: display error view & loading view
  return (
    <>
      <Flex
        p={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ borderColor: "lightgray", borderWidth: 1, borderRadius: 4 }}
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
