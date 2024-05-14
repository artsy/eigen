import { Box, Flex, Input, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { useState } from "react"
import { useDebounce } from "react-use"

export const SubmitArtworkAddDimensions = () => {
  const { setFieldValue, values } = useFormikContext<ArtworkDetailsFormModel>()
  const [dimensionMetric, setDimensionMetric] = useState(values.dimensionsMetric)

  // Debounce the metric change to improve the radio buttons UX
  useDebounce(
    () => {
      setFieldValue("dimensionsMetric", dimensionMetric)
    },
    500,
    [dimensionMetric]
  )

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

        <Flex flexDirection="row" justifyContent="space-between">
          <Box width="31%" mr={1}>
            <Input
              title={`Height (${dimensionMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_HeightInput"
              value={values.height}
              onChangeText={(e) => setFieldValue("height", e)}
              accessibilityLabel="Height"
            />
          </Box>
          <Box width="31%" mr={1}>
            <Input
              title={`Width (${dimensionMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_WidthInput"
              value={values.width}
              onChangeText={(e) => setFieldValue("width", e)}
              accessibilityLabel="Width"
            />
          </Box>
          <Box width="31%">
            <Input
              title={`Depth (${dimensionMetric})`}
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
    </Flex>
  )
}
