import { Button, Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"

export const SubmissionArtworkFormTitle: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({}) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()
  const { navigateToNextStep } = useSubmissionContext()

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
        Add artwork title
      </Text>

      <Input placeholder="Artwork Title" onChangeText={formik.handleChange("title")} />

      <Spacer y={2} />

      <Text color="black60" variant="xs">
        Add ‘Unknown’ if unsure
      </Text>

      <Spacer y={2} />

      <Button onPress={handleNextPress} block disabled={!formik.isValid}>
        Save and Continue
      </Button>
    </Flex>
  )
}
