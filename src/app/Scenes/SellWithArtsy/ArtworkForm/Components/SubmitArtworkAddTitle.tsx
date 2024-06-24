import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import {
  ArtworkDetailsFormModel,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Formik, useFormikContext } from "formik"
import { pick } from "lodash"
import { ScrollView } from "react-native"

type SubmitArtworkAddTitleModel = Pick<ArtworkDetailsFormModel, "title">

export const SubmitArtworkAddTitle = () => {
  const { values: allValues, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()
  const { currentStep } = useSubmissionContext()
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const handleSubmit = async (values: SubmitArtworkAddTitleModel) => {
    try {
      await createOrUpdateSubmission(
        {
          title: values.title,
        },
        allValues.submissionId
      )
      // This is in order to keep the formik state in sync with the screen state.
      // We can probably remove this later and fetch the title again :shrug:
      setFieldValue("title", values.title)
      navigation.navigate("AddPhotos")
      setCurrentStep("AddPhotos")
    } catch (error) {
      console.error("Failed to update submission title", error)
    }
  }

  return (
    <Formik<SubmitArtworkAddTitleModel>
      initialValues={pick(allValues, ["title"])}
      validationSchema={getCurrentValidationSchema("AddTitle")}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values }) => {
        return (
          <ProvideScreenTrackingWithCohesionSchema
            info={screen({
              context_screen_owner_type: OwnerType.submitArtworkStepAddTitle,
              context_screen_owner_id: allValues.submissionId || undefined,
            })}
          >
            <Flex px={2} flex={1}>
              <ScrollView>
                <Flex>
                  <Text variant="lg-display">Add artwork title</Text>

                  <Spacer y={2} />

                  {!!allValues.artistSearchResult && (
                    <ArtistSearchResult result={allValues.artistSearchResult} />
                  )}

                  <Spacer y={2} />

                  <Input
                    placeholder="Artwork Title"
                    onChangeText={handleChange("title")}
                    value={values.title}
                    // Only focus on the input and toggle the keyboard if this step is visible to the user.
                    autoFocus={currentStep === "AddTitle"}
                    spellCheck={false}
                    autoCorrect={false}
                  />

                  <Spacer y={2} />

                  <Text color="black60" variant="xs">
                    Add ‘Unknown’ if unsure
                  </Text>
                </Flex>
              </ScrollView>
            </Flex>
          </ProvideScreenTrackingWithCohesionSchema>
        )
      }}
    </Formik>
  )
}
