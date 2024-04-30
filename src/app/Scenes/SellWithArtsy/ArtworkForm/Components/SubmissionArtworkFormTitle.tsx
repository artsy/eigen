import { Button, Input, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { SubmissionNavigationControls } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionNavigationControls"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"

export const SubmissionArtworkFormTitle: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({ navigation }) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleSavePress = () => {
    navigation.navigate("ArtworkFormPhotos")
  }

  const handleBackPress = () => {
    navigation.navigate("ArtworkFormArtist")
  }

  return (
    <Screen>
      <Screen.Header onBack={handleBackPress} />

      <Screen.Body>
        {!!formik.values.artistSearchResult && (
          <ArtistSearchResult result={formik.values.artistSearchResult} />
        )}

        <Spacer y={2} />

        <Text variant="lg" mb={2}>
          Add artwork title
        </Text>

        <Input placeholder="Artwork Title" onChangeText={formik.handleChange("title")} />

        <Spacer y={2} />
      </Screen.Body>

      <Screen.BottomView>
        <SubmissionNavigationControls onBackPress={handleBackPress} onNextPress={handleSavePress} />
      </Screen.BottomView>
    </Screen>
  )
}
