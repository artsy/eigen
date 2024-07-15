import { OwnerType } from "@artsy/cohesion"
import { Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { ArtworkConditionEnumType } from "__generated__/myCollectionCreateArtworkMutation.graphql"
import { Select } from "app/Components/Select"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkCondition = () => {
  const { values } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const [condition, setCondition] = useState<ArtworkConditionEnumType | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation, "Condition">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        // Make API call to update submission

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
              value={condition}
              title="Add Condition"
              onSelectValue={(value) => {
                setCondition(value as ArtworkConditionEnumType)
              }}
              tooltipText="Condition Definitions"
              onTooltipPress={() => setIsModalVisible(true)}
            />

            <Spacer y={2} />

            <Input
              testID="ConditionInput"
              title="Add Additional Condition Details"
              optional
              multiline
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
