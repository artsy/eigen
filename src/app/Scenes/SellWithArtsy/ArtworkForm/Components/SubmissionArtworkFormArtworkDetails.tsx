import { Flex, Input, Screen, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { SelectOption } from "app/Components/Select"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
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
> = ({}) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()
  const { navigateToNextStep, navigateToPreviousStep } = useSubmissionContext()

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  const handleSavePress = async () => {
    const submissionId = await createOrUpdateSubmission(formik.values, "")

    formik.setFieldValue("submissionId", submissionId)
    navigateToNextStep()
  }

  const categories = useRef<Array<SelectOption<AcceptableCategoryValue>>>(
    acceptableCategoriesForSubmission()
  ).current

  return (
    <Flex>
      {!!formik.values.artistSearchResult && (
        <ArtistSearchResult result={formik.values.artistSearchResult} />
      )}

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Artwork Details
      </Text>

      <Flex>
        <Input placeholder="Year" onChangeText={formik.handleChange("year")} />
      </Flex>
      <Spacer y={2} />

      <CategoryPicker<AcceptableCategoryValue | null>
        handleChange={(category) => formik.setFieldValue("category", category)}
        options={categories}
        required={false}
        value={formik.values.category}
      />
    </Flex>
  )
}
