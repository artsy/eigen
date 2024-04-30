import { Button, Input, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"

export const SubmissionArtworkFormArtworkDetails: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({ navigation }) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleBackPress = () => {
    navigation.navigate("ArtworkFormPhotos")
  }

  const handleSavePress = () => {}

  return (
    <>
      <FancyModalHeader onLeftButtonPress={handleBackPress} hideBottomDivider></FancyModalHeader>

      <ScreenMargin>
        {!!formik.values.artistSearchResult && (
          <ArtistSearchResult result={formik.values.artistSearchResult} />
        )}

        <Spacer y={2} />

        <Text>{formik.values.artist}</Text>

        <Text variant="lg" mb={2}>
          Artwork Details
        </Text>

        <Input placeholder="Year" onChangeText={formik.handleChange("year")} />

        <Spacer y={2} />

        <Button onPress={handleSavePress}>Save and Continue</Button>
      </ScreenMargin>
    </>
  )
}
