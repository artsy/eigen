import { Box, Flex, Input, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { useRef, useState } from "react"
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

        <Flex flexDirection="row" justifyContent="space-between" flexWrap="wrap">
          <Box width="31%">
            <Input
              title={`Height (${dimensionMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_HeightInput"
              value={values.height}
              onChangeText={(e) => setFieldValue("height", e)}
              accessibilityLabel="Height"
              onSubmitEditing={() => {
                widthRef.current?.focus()
              }}
              returnKeyLabel="Next"
            />
          </Box>
          <Box width="31%">
            <Input
              title={`Width (${dimensionMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_WidthInput"
              value={values.width}
              onChangeText={(e) => setFieldValue("width", e)}
              accessibilityLabel="Width"
              ref={widthRef}
              onSubmitEditing={() => {
                depthRef.current?.focus()
              }}
              returnKeyLabel="Next"
            />
          </Box>
          <Box width="31%">
            <Input
              title={`Depth (${dimensionMetric})`}
              keyboardType="decimal-pad"
              testID="Submission_DepthInput"
              value={values.depth}
              onChangeText={(e) => setFieldValue("depth", e)}
              accessibilityLabel="Depth"
              ref={depthRef}
            />
          </Box>
        </Flex>
      </Join>
    </Flex>
  )
}
