import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Input, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  ArtworkDetailsFormModel,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Formik, useFormikContext } from "formik"
import { pick } from "lodash"
import { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useDebounce } from "react-use"

type SubmitArtworkAddDimensionsModel = Pick<
  ArtworkDetailsFormModel,
  "dimensionsMetric" | "height" | "width" | "depth"
>

export const SubmitArtworkAddDimensions = () => {
  const { setFieldValue, values: allValues } = useFormikContext<ArtworkDetailsFormModel>()
  const [dimensionMetric, setDimensionMetric] = useState(allValues.dimensionsMetric)
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)

  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()

  const widthRef = useRef<Input>(null)
  const depthRef = useRef<Input>(null)

  // Debounce the metric change to improve the radio buttons UX
  useDebounce(
    () => {
      setFieldValue("dimensionsMetric", dimensionMetric)
    },
    500,
    [dimensionMetric]
  )

  const handleSubmit = async (values: SubmitArtworkAddDimensionsModel) => {
    try {
      await createOrUpdateSubmission(values, allValues.submissionId)

      setFieldValue("dimensionsMetric", values.dimensionsMetric)
      setFieldValue("height", values.height)
      setFieldValue("width", values.width)
      setFieldValue("depth", values.depth)

      navigation.navigate("AddPhoneNumber")
      setCurrentStep("AddPhoneNumber")
    } catch (error) {
      console.error("Failed to update submission details", error)
    }
  }

  return (
    <Formik<SubmitArtworkAddDimensionsModel>
      initialValues={pick(allValues, ["dimensionsMetric", "height", "width", "depth"])}
      validationSchema={getCurrentValidationSchema("AddDimensions")}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values }) => {
        return (
          <ProvideScreenTrackingWithCohesionSchema
            info={screen({
              context_screen_owner_type: OwnerType.submitArtworkStepAddDimensions,
              context_screen_owner_id: allValues.submissionId || undefined,
            })}
          >
            <Flex px={2} flex={1}>
              <ScrollView>
                <Text variant="lg-display" mb={2}>
                  Artwork dimensions
                </Text>

                <Flex flexDirection="row">
                  <RadioButton
                    mr={2}
                    text="in"
                    selected={dimensionMetric === "in"}
                    onPress={() => {
                      setDimensionMetric("in")
                      handleChange("dimensionsMetric")("in")
                    }}
                  />
                  <RadioButton
                    text="cm"
                    selected={dimensionMetric === "cm"}
                    onPress={() => {
                      setDimensionMetric("cm")
                      handleChange("dimensionsMetric")("cm")
                    }}
                  />
                </Flex>

                <Spacer y={1} />

                <Flex flexDirection="row" justifyContent="space-between">
                  <Box flex={1}>
                    <Input
                      title="Height"
                      keyboardType="decimal-pad"
                      testID="Submission_HeightInput"
                      value={values.height}
                      onChangeText={handleChange("height")}
                      fixedRightPlaceholder={dimensionMetric}
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
                      value={values.width}
                      onChangeText={handleChange("width")}
                      fixedRightPlaceholder={dimensionMetric}
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
                    value={values.depth}
                    onChangeText={(e) => setFieldValue("depth", e)}
                    fixedRightPlaceholder={dimensionMetric}
                    accessibilityLabel="Depth"
                    ref={depthRef}
                  />
                </Box>
              </ScrollView>
            </Flex>
          </ProvideScreenTrackingWithCohesionSchema>
        )
      }}
    </Formik>
  )
}
