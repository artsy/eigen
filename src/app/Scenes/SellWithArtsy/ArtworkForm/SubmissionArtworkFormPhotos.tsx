import { Button, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"

export const SubmissionArtworkFormPhotos: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({ navigation }) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleSavePress = () => {
    navigation.navigate("ArtworkFormArtworkDetails")
  }

  const handleBackPress = () => {
    navigation.navigate("ArtworkFormTitle")
  }

  return (
    <>
      <FancyModalHeader onLeftButtonPress={handleBackPress} hideBottomDivider></FancyModalHeader>

      <ScreenMargin>
        {!!formik.values.artistSearchResult && (
          <ArtistSearchResult result={formik.values.artistSearchResult} />
        )}

        <Text>{formik.values.title}</Text>

        <Spacer y={2} />

        <Text variant="lg" mb={2}>
          Upload photos of your artwork
        </Text>

        <Button onPress={handleSavePress}>Save and Continue</Button>
      </ScreenMargin>
    </>
  )
}
