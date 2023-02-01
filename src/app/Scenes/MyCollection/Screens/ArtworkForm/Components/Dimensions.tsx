import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { throttle } from "lodash"
import { Flex, Input, RadioButton, Spacer, Text } from "palette"
import React, { useState } from "react"

export const Dimensions: React.FC = () => {
  const { formik } = useArtworkForm()

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
      <Spacer mt="1" mb="0.5" />
      <Flex flexDirection="row">
        <RadioButton
          onPress={() => handleMetricChange("cm")}
          selected={localMetric === "cm"}
          text="cm"
        />

        <Spacer mr={3} />

        <RadioButton
          onPress={() => handleMetricChange("in")}
          selected={localMetric === "in"}
          text="in"
        />
      </Flex>
      <Spacer my={1} />
      <Flex flexDirection="row">
        <Flex mr={1} flex={1}>
          <Input
            title="HEIGHT"
            keyboardType="decimal-pad"
            onChangeText={formik.handleChange("height")}
            onBlur={formik.handleBlur("height")}
            value={formik.values.height}
            testID="HeightInput"
          />
        </Flex>
        <Flex mr={1} flex={1}>
          <Input
            title="WIDTH"
            keyboardType="decimal-pad"
            onChangeText={formik.handleChange("width")}
            onBlur={formik.handleBlur("width")}
            value={formik.values.width}
            testID="WidthInput"
          />
        </Flex>
        <Flex flex={1}>
          <Input
            title="DEPTH"
            keyboardType="decimal-pad"
            onChangeText={formik.handleChange("depth")}
            onBlur={formik.handleBlur("depth")}
            value={formik.values.depth}
            testID="DepthInput"
          />
        </Flex>
      </Flex>
    </>
  )
}
