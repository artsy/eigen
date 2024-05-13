import { Box, Button, Flex, Input, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useFormikContext } from "formik"

export const SubmitArtworkAddDimensions = () => {
  const { isValid, setFieldValue, values } = useFormikContext<ArtworkDetailsFormModel>()
  const { navigateToNextStep } = useSubmissionContext()

  const handleNextPress = async () => {
    await createOrUpdateSubmission(values, values.submissionId)

    navigateToNextStep()
  }

  return (
    <Flex>
      {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Artwork dimensions
      </Text>

      <Join separator={<Spacer y={2} />}>
        <Flex flexDirection="row">
          <RadioButton
            mr={2}
            text="in"
            selected={values.dimensionsMetric === "in"}
            onPress={() => setFieldValue("dimensionsMetric", "in")}
          />
          <RadioButton
            text="cm"
            selected={values.dimensionsMetric === "cm"}
            onPress={() => setFieldValue("dimensionsMetric", "cm")}
          />
        </Flex>

        <Flex flexDirection="row" justifyContent="space-between">
          <Box width="31%" mr={1}>
            <Input
              title={`Height (${values.dimensionsMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_HeightInput"
              value={values.height}
              onChangeText={(e) => setFieldValue("height", e)}
              accessibilityLabel="Height"
            />
          </Box>
          <Box width="31%" mr={1}>
            <Input
              title={`Width (${values.dimensionsMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_WidthInput"
              value={values.width}
              onChangeText={(e) => setFieldValue("width", e)}
              accessibilityLabel="Width"
            />
          </Box>
          <Box width="31%">
            <Input
              title={`Depth (${values.dimensionsMetric})`}
              optional
              keyboardType="decimal-pad"
              testID="Submission_DepthInput"
              value={values.depth}
              onChangeText={(e) => setFieldValue("depth", e)}
              accessibilityLabel="Depth"
            />
          </Box>
        </Flex>
      </Join>

      <Spacer y={2} />

      <Button onPress={handleNextPress} block disabled={!isValid}>
        Save and Continue
      </Button>
    </Flex>
  )
}
