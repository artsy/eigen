import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { Metric } from "lib/Scenes/Search/UserPreferencesModel"
import { GlobalStore } from "lib/store/GlobalStore"
import { Flex, Input, RadioButton, Spacer, Text } from "palette"
import React from "react"

export const Dimensions: React.FC = () => {
  const { formik } = useArtworkForm()

  const handleMetricChange = (unit: Metric) => {
    GlobalStore.actions.userPreferences.setMetric(unit)
    formik.handleChange("metric")(unit)
  }

  return (
    <>
      <Flex flexDirection="row">
        <Text variant="xs">DIMENSIONS</Text>
      </Flex>
      <Spacer mt={1} mb={0.3} />
      <Flex flexDirection="row">
        <RadioButton
          selected={formik.values.metric === "cm"}
          onPress={() => handleMetricChange("cm")}
        />
        <Text marginRight="3">cm</Text>
        <RadioButton
          selected={formik.values.metric === "in"}
          onPress={() => handleMetricChange("in")}
        />
        <Text>in</Text>
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
