import { ConsignmentAttributionClass } from "__generated__/updateConsignmentSubmissionMutation.graphql"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkRarityClassifications } from "lib/utils/artworkMediumCategories"
import { Flex, Input, Text } from "palette"
import { Select } from "palette/elements/Select"
import React from "react"

export const RarityPicker: React.FC = () => {
  const { formik } = useArtworkForm()

  const handleValueChange = (value: ConsignmentAttributionClass) => {
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
      />
      {formik.values.attributionClass === "Limited Edition" ? (
        <Flex flexDirection="row" mt={2}>
          <Flex flex={1}>
            <Input
              title="EDITION NUMBER"
              keyboardType="decimal-pad"
              onChangeText={formik.handleChange("editionNumber")}
              onBlur={formik.handleBlur("editionNumber")}
              value={formik.values.editionNumber}
            />
          </Flex>
          <Flex justifyContent="center" mx={2} mt={1}>
            <Text>/</Text>
          </Flex>
          <Flex flex={1}>
            <Input
              title="EDIION SIZE"
              keyboardType="decimal-pad"
              onChangeText={formik.handleChange("editionSize")}
              onBlur={formik.handleBlur("editionSize")}
              value={formik.values.editionSize}
            />
          </Flex>
        </Flex>
      ) : null}
    </>
  )
}
