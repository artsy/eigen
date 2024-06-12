import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkAddTitle = () => {
  const { handleChange, values } = useFormikContext<ArtworkDetailsFormModel>()
  const { currentStep } = useSubmissionContext()

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepAddTitle,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView>
          <Flex>
            <Text variant="lg-display">Add artwork title</Text>

            <Spacer y={2} />

            {!!values.artistSearchResult && (
              <ArtistSearchResult result={values.artistSearchResult} />
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
}
