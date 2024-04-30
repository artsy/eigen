import { Button, Input, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { SelectOption } from "app/Components/Select"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { SubmissionNavigationControls } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionNavigationControls"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import {
  AcceptableCategoryValue,
  acceptableCategoriesForSubmission,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/acceptableCategoriesForSubmission"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"
import { useRef } from "react"

export const SubmissionArtworkFormArtworkDetails: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({ navigation }) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  const handleBackPress = () => {
    navigation.navigate("ArtworkFormPhotos")
  }

  const handleSavePress = async () => {
    const submissionId = await createOrUpdateSubmission(formik.values, "")

    formik.setFieldValue("submissionId", submissionId)
  }

  const categories = useRef<Array<SelectOption<AcceptableCategoryValue>>>(
    acceptableCategoriesForSubmission()
  ).current

  return (
    <Screen>
      <Screen.Header onBack={handleBackPress} />

      <Screen.Body>
        {!!formik.values.artistSearchResult && (
          <ArtistSearchResult result={formik.values.artistSearchResult} />
        )}

        <Spacer y={2} />

        <Text variant="lg" mb={2}>
          Artwork Details
        </Text>

        <Input placeholder="Year" onChangeText={formik.handleChange("year")} />

        <Spacer y={2} />

        <CategoryPicker<AcceptableCategoryValue | null>
          handleChange={(category) => formik.setFieldValue("category", category)}
          options={categories}
          required={false}
          value={formik.values.category}
        />
      </Screen.Body>

      <Screen.BottomView>
        <SubmissionNavigationControls onBackPress={handleBackPress} onNextPress={handleSavePress} />
      </Screen.BottomView>
    </Screen>
  )
}
