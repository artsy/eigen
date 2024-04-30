import { Screen, Spacer } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { goBack } from "app/system/navigation/navigate"
import { ProvidePlaceholderContext, PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { Suspense } from "react"
import { ArtistAutosuggest } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistAutosuggest"
import { useFormikContext } from "formik"
import { Text } from "@artsy/palette-mobile"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"

export const SubmissionArtworkFormArtist: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormArtist">
> = ({ navigation }) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleResultPress = async (result: AutosuggestResult) => {
    formik.setFieldValue("artist", result.displayLabel)
    formik.setFieldValue("artistId", result.internalID)
    formik.setFieldValue("artistSearchResult", result)

    navigation.navigate("ArtworkFormTitle")
  }
  const handleSkipPress = () => {}

  const handleBackPress = () => {
    goBack()
  }

  return (
    <Screen>
      <Screen.Header onBack={handleBackPress} />

      <Screen.Body>
        <Text variant="lg" mb={2}>
          Add artist name
        </Text>

        <Suspense fallback={<Placeholder />}>
          <ArtistAutosuggest onResultPress={handleResultPress} onSkipPress={handleSkipPress} />
        </Suspense>
      </Screen.Body>
    </Screen>
  )
}

const Placeholder: React.FC = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox height={50} />
    <Spacer y={2} />
    <PlaceholderText width={250} />
    <Spacer y={4} />
    <PlaceholderText width={180} />
    <Spacer y={2} />
    <AutosuggestResultsPlaceholder />
  </ProvidePlaceholderContext>
)
