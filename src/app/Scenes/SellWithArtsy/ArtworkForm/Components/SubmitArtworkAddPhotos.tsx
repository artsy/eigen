import { Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { UploadPhotosForm } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosForm"
import { Photo } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkAddPhotos: React.FC<
  StackScreenProps<SubmitArtworkStackNavigation, "AddPhotos">
> = ({}) => {
  const { values } = useFormikContext<ArtworkDetailsFormModel>()

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
    </ScrollView>
  )
}
