import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"

export const SubmissionArtworkFormPhotos: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({}) => {
  const { navigateToNextStep } = useSubmissionContext()
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleNextPress = () => {
    navigateToNextStep()
  }

  return (
    <Flex>
      {!!formik.values.artistSearchResult && (
        <ArtistSearchResult result={formik.values.artistSearchResult} />
      )}

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Upload photos of your artwork
      </Text>

      <Spacer y={2} />

      <Text color="black60" variant="xs">
        Add more photos to help speed up your submission and increase your chances of selling. Tips
        for taking photos
      </Text>

      <Spacer y={2} />

      {/* TODO: Add photo picker component */}

      <Spacer y={2} />

      <Button onPress={handleNextPress} block disabled={!formik.isValid}>
        Save and Continue
      </Button>
    </Flex>
  )
}
