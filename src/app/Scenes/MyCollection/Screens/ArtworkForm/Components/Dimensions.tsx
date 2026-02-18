import { Spacer, Flex, Text, RadioButton, Input, InputRef } from "@artsy/palette-mobile"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { throttle } from "lodash"
import { Ref, useRef, useState } from "react"

interface DimensionsProps {
  ref?: Ref<InputRef>
  onSubmitEditing?: () => void
}

export const Dimensions: React.FC<DimensionsProps> = ({ ref: heightRef, onSubmitEditing }) => {
  const { formik } = useArtworkForm()
  const widthRef = useRef<InputRef>(null)
  const depthRef = useRef<InputRef>(null)

  // Using a local state to improve performance
  const [localMetric, setLocalMetric] = useState(formik.values.metric)

  const handleMetricChange = throttle((unit: Metric) => {
    if (unit !== localMetric) {
      setLocalMetric(unit)

      formik.handleChange("metric")(unit)
      GlobalStore.actions.userPrefs.setMetric(unit)
    }
  }, 100)

  return (
    <>
      <Flex flexDirection="row">
        <Text variant="xs">DIMENSIONS</Text>
      </Flex>
      <Spacer y={1} />
      <Flex flexDirection="row">
        <RadioButton
          onPress={() => handleMetricChange("in")}
          selected={localMetric === "in"}
          text="in"
        />

        <Spacer x={4} />

        <RadioButton
          onPress={() => handleMetricChange("cm")}
          selected={localMetric === "cm"}
          text="cm"
        />
      </Flex>
      <Spacer y={1} />
      <Flex flexDirection="row">
        <Flex mr={1} flex={1}>
          <Input
            ref={heightRef}
            title={`Height (${localMetric})`}
            keyboardType="decimal-pad"
            onChangeText={formik.handleChange("height")}
            onBlur={formik.handleBlur("height")}
            value={formik.values.height}
            testID="HeightInput"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => widthRef.current?.focus()}
          />
        </Flex>
        <Flex mr={1} flex={1}>
          <Input
            ref={widthRef}
            title={`Width (${localMetric})`}
            keyboardType="decimal-pad"
            onChangeText={formik.handleChange("width")}
            onBlur={formik.handleBlur("width")}
            value={formik.values.width}
            testID="WidthInput"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => depthRef.current?.focus()}
          />
        </Flex>
        <Flex flex={1}>
          <Input
            ref={depthRef}
            title={`Depth (${localMetric})`}
            keyboardType="decimal-pad"
            onChangeText={formik.handleChange("depth")}
            onBlur={formik.handleBlur("depth")}
            value={formik.values.depth}
            testID="DepthInput"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={onSubmitEditing}
          />
        </Flex>
      </Flex>
    </>
  )
}
