import { OwnerType } from "@artsy/cohesion"
import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Select } from "app/Components/Select"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"

export const PROVENANCE_LIST = [
  "Purchased directly from gallery",
  "Purchased directly from artist",
  "Purchased at auction",
  "Gift from the artist",
  "Other",
  "I don’t know",
].map((provenance) => ({
  value: provenance,
  label: provenance,
}))

export const SubmitArtworkPurchaseHistory = () => {
  const { setFieldValue, values } = useFormikContext<SubmissionModel>()

  const [isSigned, setIsSigned] = useState(values.signature)

  const { show: showToast } = useToast()

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation =
    useNavigation<NavigationProp<SubmitArtworkStackNavigation, "PurchaseHistory">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        await createOrUpdateSubmission(
          {
            provenance: values.provenance,
            signature: values.signature,
          },
          values.submissionId
        )

        navigation.navigate("AddDimensions")
        setCurrentStep("AddDimensions")
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

  useEffect(() => {
    // This is required for performance reasons
    // We don't want to set the value of the form field on every render
    if (isSigned !== null && isSigned !== undefined) {
      setFieldValue("signature", isSigned)
    }
  }, [isSigned, setFieldValue])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepPurchaseHistory,
        context_screen_owner_id: values.submissionId || undefined,
      })}
    >
      <Flex px={2} flex={1}>
        <ScrollView>
          <Text variant="lg-display" mb={2}>
            Where did you purchase the artwork?
          </Text>

          <Spacer y={2} />

          <Join separator={<Spacer y={2} />}>
            <Flex>
              <Select
                options={PROVENANCE_LIST}
                title="Purchase information"
                testID="PurchaseInformation_Select"
                onSelectValue={(value) => {
                  setFieldValue("provenance", value)
                }}
                value={values.provenance}
              />
            </Flex>

            <Flex>
              <Text>Is the work signed?</Text>
              <Flex flexDirection="row" mt={2}>
                <RadioButton
                  mr={2}
                  text="Yes"
                  textVariant="sm-display"
                  accessibilityState={{ checked: !!isSigned }}
                  accessibilityLabel="Work is signed"
                  selected={isSigned === true}
                  onPress={() => {
                    setIsSigned(true)
                  }}
                />
                <RadioButton
                  text="No"
                  textVariant="sm-display"
                  accessibilityState={{ checked: !!isSigned }}
                  accessibilityLabel="Work is not signed"
                  selected={isSigned === false}
                  onPress={() => {
                    setIsSigned(false)
                  }}
                />
              </Flex>
            </Flex>
          </Join>
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
