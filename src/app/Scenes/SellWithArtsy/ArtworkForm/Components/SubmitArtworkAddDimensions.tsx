import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Input, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useDebounce } from "react-use"

export const SubmitArtworkAddDimensions = () => {
  const { setFieldValue, values } = useFormikContext<ArtworkDetailsFormModel>()
  const [dimensionMetric, setDimensionMetric] = useState(values.dimensionsMetric)

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

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.submitArtworkStepAddDimensions,
        context_screen_owner_id: values.submissionId || undefined,
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
              }}
            />
            <RadioButton
              text="cm"
              selected={dimensionMetric === "cm"}
              onPress={() => {
                setDimensionMetric("cm")
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
                onChangeText={(e) => setFieldValue("height", e)}
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
                onChangeText={(e) => setFieldValue("width", e)}
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
}
