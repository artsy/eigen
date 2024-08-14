import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Input, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { myCollectionUpdateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionUpdateArtwork"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useRef } from "react"
import { LayoutAnimation, ScrollView } from "react-native"

export const SubmitArtworkFrameInformation = () => {
  const { values, setFieldValue, handleChange } = useFormikContext<SubmissionModel>()

  const { show: showToast } = useToast()

  const widthRef = useRef<Input>(null)
  const depthRef = useRef<Input>(null)

  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation =
    useNavigation<NavigationProp<SubmitArtworkStackNavigation, "FrameInformation">>()

  useNavigationListeners({
    onNextStep: async () => {
      try {
        setIsLoading(true)

        if (!values.artwork.internalID) {
          throw new Error("Artwork ID is required")
        }

        const newValues = {
          artworkId: values.artwork.internalID,
          framedMetric: values.artwork.framedMetric,
          framedWidth: values.artwork.framedWidth,
          framedHeight: values.artwork.framedHeight,
          framedDepth: values.artwork.framedDepth,
          isFramed: values.artwork.isFramed,
        }

        // Make API call to update related My Collection artwork
        await myCollectionUpdateArtwork(newValues)

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

            <Text variant="sm-display" mt={2}>
              Is the work framed?
            </Text>

            <Flex flexDirection="row" mt={2}>
              <RadioButton
                text="Yes"
                selected={values.artwork.isFramed === true}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  setFieldValue("artwork.isFramed", true)
                }}
              />

              <Spacer x={4} />

              <RadioButton
                text="No"
                selected={values.artwork.isFramed === false}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  setFieldValue("artwork.isFramed", false)
                  setFieldValue("artwork.framedMetric", null)
                  setFieldValue("artwork.framedWidth", null)
                  setFieldValue("artwork.framedHeight", null)
                  setFieldValue("artwork.framedDepth", null)
                }}
              />
            </Flex>

            {values.artwork.isFramed === true && (
              <Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                  <Box flex={1}>
                    <Input
                      title="Height"
                      keyboardType="decimal-pad"
                      testID="Frame_Height_Input"
                      value={values.artwork.framedHeight || ""}
                      onChangeText={handleChange("artwork.framedHeight")}
                      fixedRightPlaceholder={values.artwork.framedMetric || ""}
                      accessibilityLabel="Frame Height"
                      onSubmitEditing={() => {
                        widthRef.current?.focus()
                      }}
                      returnKeyLabel="Next"
                    />
                  </Box>

                  <Spacer x={2} />

                  <Box flex={1}>
                    <Input
                      title="Width"
                      keyboardType="decimal-pad"
                      testID="Frame_WidthI_nput"
                      value={values.artwork.framedWidth || ""}
                      onChangeText={handleChange("artwork.framedWidth")}
                      fixedRightPlaceholder={values.artwork.framedMetric || ""}
                      accessibilityLabel="Frame Width"
                      ref={widthRef}
                      onSubmitEditing={() => {
                        depthRef.current?.focus()
                      }}
                      returnKeyLabel="Next"
                    />
                  </Box>
                </Flex>

                <Box width="50%" pr={1}>
                  <Input
                    title="Depth"
                    keyboardType="decimal-pad"
                    testID="Frame_DepthI_nput"
                    value={values.artwork.framedDepth || ""}
                    onChangeText={handleChange("artwork.framedDepth")}
                    fixedRightPlaceholder={values.artwork.framedMetric || ""}
                    accessibilityLabel="Frame Depth"
                    ref={depthRef}
                  />
                </Box>

                <Spacer y={2} />

                <Flex flexDirection="row">
                  <RadioButton
                    text="in"
                    selected={values.artwork.framedMetric === "in"}
                    onPress={() => {
                      setFieldValue("artwork.framedMetric", "in")
                    }}
                  />

                  <Spacer x={4} />

                  <RadioButton
                    text="cm"
                    selected={values.artwork.framedMetric === "cm"}
                    onPress={() => {
                      setFieldValue("artwork.framedMetric", "cm")
                    }}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
        </ScrollView>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
