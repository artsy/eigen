import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { captureException } from "@sentry/react-native"
import { myCollectionUpdateArtworkMutation } from "__generated__/myCollectionUpdateArtworkMutation.graphql"
import { Select } from "app/Components/Select"
import { useToast } from "app/Components/Toast/toastHook"
import { myCollectionUpdateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionUpdateArtwork"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { updateMyCollectionArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/updateMyCollectionArtwork"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { GlobalStore } from "app/store/GlobalStore"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkCondition = () => {
  const { values, handleChange, setFieldValue } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "Condition">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        if (!values.artwork.internalID) {
          captureException("Artwork ID is required")
          showToast("Could not save your submission, please try again.", "bottom", {
            backgroundColor: "red100",
          })
          return
        }

        // Make API call to update related My Collection artwork
        const newValues: myCollectionUpdateArtworkMutation["variables"]["input"] = {
          artworkId: values.artwork.internalID,
          condition: values.artwork.condition,
          conditionDescription: values.artwork.conditionDescription,
        }

        // Make API call to update related My Collection artwork
        await myCollectionUpdateArtwork(newValues)

        // Update submission state
        await createOrUpdateSubmission(
          {
            state: "RESUBMITTED",
          },
          values.submissionId
        )
        // Reset saved draft if submission is successful
        GlobalStore.actions.artworkSubmission.setDraft(null)
        // Refetch associated My Collection artwork to display the updated submission status on the artwork screen.
        if (values.myCollectionArtworkID) {
          await updateMyCollectionArtwork({
            artworkID: values.myCollectionArtworkID,
          })
        }

        refreshMyCollection()

        navigation.navigate("CompleteYourSubmission")
        setCurrentStep("CompleteYourSubmission")
      } catch (error) {
        console.error("Error setting title", error)
        showToast("Could not save your submission, please try again.", "bottom", {
          backgroundColor: "red100",
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepCondition,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView>
          <Flex>
            <Text variant="lg-display">Condition</Text>

            <Spacer y={2} />

            <Text color="black60" variant="xs">
              Let us know the condition of the piece. Note: the seller is liable for correct
              description lorem ipsum dolor sit amet
            </Text>

            <Spacer y={2} />

            <Select
              testID="ConditionSelect"
              options={[
                { label: "Excellent", value: "EXCELLENT" },
                { label: "Very Good", value: "VERY_GOOD" },
                { label: "Good", value: "GOOD" },
                { label: "Fair", value: "FAIR" },
              ]}
              value={values.artwork.condition}
              title="Add Condition"
              onSelectValue={(value) => {
                setFieldValue("artwork.condition", value)
              }}
              tooltipText="Condition Definitions"
              onTooltipPress={() => setIsModalVisible(true)}
            />

            <Spacer y={2} />

            <Input
              testID="ConditionInput"
              title="Add Additional Condition Details"
              defaultValue={values.artwork.conditionDescription || ""}
              multiline
              onChangeText={handleChange("artwork.conditionDescription")}
            />
          </Flex>
        </ScrollView>
        <InfoModal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          buttonVariant="outline"
          fullScreen
        >
          <ScrollView>
            <Text variant="lg-display">Condition Definitions</Text>

            <Spacer y={2} />

            {CONDITION_DEFINITIONS.map((definition) => {
              return (
                <Flex key={definition.title} mb={2}>
                  <Text variant="sm-display" fontWeight="bold" mb={0.5}>
                    {definition.title}:
                  </Text>
                  <Text variant="sm-display">{definition.description}</Text>
                </Flex>
              )
            })}
          </ScrollView>
        </InfoModal>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const CONDITION_DEFINITIONS = [
  {
    title: "Excellent Condition",
    description:
      "No signs of age or wear, undulation associated with hinging. Work may be unsealed in original packaging.",
  },
  {
    title: "Very Good Condition",
    description:
      "Overall very good condition, minor signs of wear or age such as light handling creases, scuffing, foxing, discoloration, buckling, and pinholes. Also includes works that have been previously restored.",
  },
  {
    title: "Good Condition",
    description:
      "Overall good condition but with noticeable wear or age such as hard creases, scratches, indentations, water damage (associated buckling), foxing, discoloration, attenuation, material loss and tearing. May require the attention of a conservator.",
  },
  {
    title: "Fair Condition",
    description:
      "Overall fair condition with significant wear and age that requires the attention of a conservator.",
  },
]
