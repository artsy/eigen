import { Button, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { UploadPhotosForm } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmissionArtworkFormPhotos: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({}) => {
  const { navigateToNextStep } = useSubmissionContext()
  const { isValid, values } = useFormikContext<ArtworkDetailsFormModel>()

  const handleNextPress = () => {
    // TODO: Add photos to submission

    navigateToNextStep()
  }

  const isAnyPhotoLoading = values.photos.some((photo: Photo) => photo.loading)

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
      {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

      <Spacer y={2} />

      <Text variant="lg">Upload photos of your artwork</Text>

      <Spacer y={2} />

      <Text color="black60" variant="xs">
        Add more photos to help speed up your submission and increase your chances of selling. Tips
        for taking photos
      </Text>

      <UploadPhotosForm isAnyPhotoLoading={isAnyPhotoLoading} />

      <Spacer y={2} />

      <Button onPress={handleNextPress} block disabled={!isValid}>
        Save and Continue
      </Button>
    </ScrollView>
  )
}
