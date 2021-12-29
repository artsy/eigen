import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkRarityClassifications } from "lib/utils/artworkRarityClassifications"
import { Flex, Input, InputTitle, Spacer, Text } from "palette"
import { Select } from "palette/elements/Select"
import React from "react"

export type AttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION"

export const Rarity: React.FC = () => {
  const { formik } = useArtworkForm()

  const handleValueChange = (value: AttributionClassType) => {
    formik.handleChange("attributionClass")(value)
  }

  return (
    <>
      <Select
        onSelectValue={handleValueChange}
        value={formik.values.attributionClass}
        enableSearch={false}
        title="Rarity"
        placeholder="Select"
        options={artworkRarityClassifications}
        testID="rarity-select"
      />
      {formik.values.attributionClass === "LIMITED_EDITION" ? (
        <>
          <Flex flexDirection="row" mt={2}>
            <Flex flex={1}>
              <InputTitle>Edition number</InputTitle>
            </Flex>
            <Flex>
              <Spacer mx={2} />
            </Flex>
            <Flex flex={1} ml={1}>
              <InputTitle>Edition size</InputTitle>
            </Flex>
          </Flex>
          <Flex flexDirection="row">
            <Flex flex={1}>
              <Input
                keyboardType="decimal-pad"
                onChangeText={formik.handleChange("editionNumber")}
                onBlur={formik.handleBlur("editionNumber")}
                value={formik.values.editionNumber}
              />
            </Flex>
            <Flex justifyContent="center" mx={2}>
              <Text>/</Text>
            </Flex>
            <Flex flex={1}>
              <Input
                keyboardType="decimal-pad"
                onChangeText={formik.handleChange("editionSize")}
                onBlur={formik.handleBlur("editionSize")}
                value={formik.values.editionSize}
              />
            </Flex>
          </Flex>
        </>
      ) : null}
    </>
  )
}
