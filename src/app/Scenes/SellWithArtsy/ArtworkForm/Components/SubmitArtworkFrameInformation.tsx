import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Input, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { useNavigationListeners } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useNavigationListeners"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useRef, useState } from "react"
import { LayoutAnimation, ScrollView } from "react-native"

export const SubmitArtworkFrameInformation = () => {
  const { values, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()

  const { show: showToast } = useToast()

  const [isFramed, setIsFramed] = useState<Boolean | null>(null)
  const [height, setHeight] = useState<string | undefined>(undefined)
  const [width, setWidth] = useState<string | undefined>(undefined)
  const [depth, setDepth] = useState<string | undefined>(undefined)

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

            <Text variant="sm-display" mt={2}>
              Is the work framed?
            </Text>

            <Flex flexDirection="row" mt={2}>
              <RadioButton
                mr={4}
                text="Yes"
                selected={isFramed === true}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  setIsFramed(true)
                }}
              />
              <RadioButton
                text="No"
                selected={isFramed === false}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                  setIsFramed(false)
                }}
              />
            </Flex>

            {isFramed === true && (
              <Flex>
                <Flex flexDirection="row" justifyContent="space-between">
                  <Box flex={1}>
                    <Input
                      title="Height"
                      keyboardType="decimal-pad"
                      testID="Submission_HeightInput"
                      value={height}
                      onChangeText={setHeight}
                      fixedRightPlaceholder={values.dimensionsMetric}
                      accessibilityLabel="Height"
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
                      testID="Submission_WidthInput"
                      value={width}
                      onChangeText={setWidth}
                      fixedRightPlaceholder={values.dimensionsMetric}
                      accessibilityLabel="Width"
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
                    testID="Submission_DepthInput"
                    value={depth}
                    onChangeText={setDepth}
                    fixedRightPlaceholder={values.dimensionsMetric}
                    accessibilityLabel="Depth"
                    ref={depthRef}
                  />
                </Box>

                <Spacer y={2} />

                <Flex flexDirection="row">
                  <RadioButton
                    mr={2}
                    text="in"
                    selected={values.dimensionsMetric === "in"}
                    onPress={() => {
                      setFieldValue("dimensionsMetric", "in")
                    }}
                  />
                  <RadioButton
                    text="cm"
                    selected={values.dimensionsMetric === "cm"}
                    onPress={() => {
                      setFieldValue("dimensionsMetric", "in")
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
