import { OwnerType } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { ScrollView } from "react-native"

export const SubmitArtworkFrameInformation = () => {
  const { values } = useFormikContext<ArtworkDetailsFormModel>()

  const { show: showToast } = useToast()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation =
    useNavigation<NavigationProp<SubmitArtworkStackNavigation, "FrameInformation">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        // Make API call to update submission

        navigation.navigate("AdditionalDocuments")
        setCurrentStep("AdditionalDocuments")
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
        context_screen_owner_type: OwnerType.submitArtworkStepFrameInformation,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView>
          <Flex>
            <Text variant="lg-display">Frame</Text>

            <Spacer y={2} />
          </Flex>
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
