import { Input } from "lib/Components/Input/Input"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/ArtworkFormModal/Form/useArtworkForm"
import { Flex, RadioButton, Spacer, Text, useSpace } from "palette"
import React from "react"

export const Dimensions: React.FC = () => {
  const space = useSpace()
  const { formik } = useArtworkForm()

  return (
    <>
      <Flex flexDirection="row">
        <Text size="xs">DIMENSIONS</Text>
      </Flex>
      <Spacer my={1} />
      <Flex flexDirection="row">
        <RadioButton selected={formik.values.metric === "cm"} onPress={() => formik.handleChange("metric")("cm")} />
        <Text marginRight="3">cm</Text>
        <RadioButton selected={formik.values.metric === "in"} onPress={() => formik.handleChange("metric")("in")} />
        <Text>in</Text>
      </Flex>
      <Spacer my={1} />
      <Flex flexDirection="row">
        <Input
          title="HEIGHT"
          keyboardType="decimal-pad"
          onChangeText={formik.handleChange("height")}
          onBlur={formik.handleBlur("height")}
          defaultValue={formik.values.height}
          style={{ marginRight: space(1) }}
        />
        <Input
          title="WIDTH"
          keyboardType="decimal-pad"
          onChangeText={formik.handleChange("width")}
          onBlur={formik.handleBlur("width")}
          defaultValue={formik.values.width}
          style={{ marginRight: space(1) }}
        />
        <Input
          title="DEPTH"
          keyboardType="decimal-pad"
          onChangeText={formik.handleChange("depth")}
          onBlur={formik.handleBlur("depth")}
          defaultValue={formik.values.depth}
        />
      </Flex>
    </>
  )
}

export type Metric = "in" | "cm" | ""
