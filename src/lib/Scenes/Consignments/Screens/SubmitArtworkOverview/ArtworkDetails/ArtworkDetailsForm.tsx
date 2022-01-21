import { useFormikContext } from "formik"
import { artworkRarityClassifications } from "lib/utils/artworkRarityClassifications"
import { Box, Flex, Input, InputTitle, RadioButton, Spacer, Text } from "palette"
import { Select } from "palette/elements/Select"
import React, { useState } from "react"
import { rarityOptions } from "../utils/rarityOptions"
import { limitedEditionValue } from "../utils/rarityOptions"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { InfoModal } from "./Components/InfoModal"
import { LocationAutocomplete } from "./Components/LocationAutocomplete"

export interface Location {
  city: string
  state: string
  country: string
}

export interface ArtworkDetailsFormModel {
  artist: string
  artistId: string
  title: string
  year: string
  medium: string
  attributionClass: string
  editionNumber: string
  editionSizeFormatted: string
  dimensionsMetric: string
  height: string
  width: string
  depth: string
  provenance: string
  state: string
  utmMedium: string
  utmSource: string
  utmTerm: string
  location: Location
}

export const ArtworkDetailsForm: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()
  const [isRarityInfoModalVisible, setIsRarityInfoModalVisible] = useState(false)
  const [isProvenanceInfoModalVisible, setIsProvenanceInfoModalVisible] = useState(false)

  return (
    <Flex flexDirection="column">
      <ArtistAutosuggest />
      <Spacer mt={2} />
      <Input
        title="Title"
        placeholder="Add Title or Write 'Unknown'"
        testID="Consignment_TitleInput"
        value={values.title}
        onChangeText={(e) => setFieldValue("title", e)}
      />
      <Spacer mt={2} />
      <Input
        title="Year"
        placeholder="YYYY"
        testID="Consignment_YearInput"
        value={values.year}
        onChangeText={(e) => setFieldValue("year", e)}
      />
      <Spacer mt={2} />
      <Input
        title="Materials"
        placeholder="Oil on Canvas, Mixed Media, Lithograph.."
        testID="Consignment_MaterialsInput"
        value={values.medium}
        onChangeText={(e) => setFieldValue("medium", e)}
      />
      <Spacer mt={2} />
      <Select
        onSelectValue={(e) => setFieldValue("attributionClass", e)}
        value={values.attributionClass}
        enableSearch={false}
        title="Rarity"
        tooltipText="What is this?"
        onTooltipPress={() => setIsRarityInfoModalVisible(true)}
        placeholder="Select a Classification"
        options={rarityOptions}
      />
      <InfoModal
        title="Classifications"
        visible={isRarityInfoModalVisible}
        onDismiss={() => setIsRarityInfoModalVisible(false)}
      >
        {artworkRarityClassifications.map((classification) => (
          <Flex mb={2} key={classification.label}>
            <InputTitle>{classification.label}</InputTitle>
            <Text>{classification.description}</Text>
          </Flex>
        ))}
      </InfoModal>
      {values.attributionClass === limitedEditionValue && (
        <>
          <Spacer mt={2} />
          <Flex flexDirection="row" justifyContent="space-between">
            <Box width="48%" mr={1}>
              <Input
                title="Edition Number"
                testID="Consignment_EditionNumberInput"
                value={values.editionNumber}
                onChangeText={(e) => setFieldValue("editionNumber", e)}
              />
            </Box>
            <Box width="48%">
              <Input
                title="Edition Size"
                testID="Consignment_EditionSizeInput"
                value={values.editionSizeFormatted}
                onChangeText={(e) => setFieldValue("editionSizeFormatted", e)}
              />
            </Box>
          </Flex>
        </>
      )}

      <Spacer mt={2} />
      <InputTitle>Dimensions</InputTitle>
      <Spacer mt={1} />
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
      <Spacer mt={2} />
      <Flex flexDirection="row" justifyContent="space-between">
        <Box width="31%" mr={1}>
          <Input
            title="Height"
            testID="Consignment_HeightInput"
            value={values.height}
            onChangeText={(e) => setFieldValue("height", e)}
          />
        </Box>
        <Box width="31%" mr={1}>
          <Input
            title="Width"
            testID="Consignment_WidthInput"
            value={values.width}
            onChangeText={(e) => setFieldValue("width", e)}
          />
        </Box>
        <Box width="31%">
          <Input
            title="Depth"
            testID="Consignment_DepthInput"
            value={values.depth}
            onChangeText={(e) => setFieldValue("depth", e)}
          />
        </Box>
      </Flex>
      <Spacer mt={2} />
      <Flex flexDirection="row" justifyContent="space-between">
        <InputTitle>Provenance</InputTitle>
        <Text variant="xs" color="black60" onPress={() => setIsProvenanceInfoModalVisible(true)}>
          What is this?
        </Text>
      </Flex>
      <Input
        placeholder="Describe How You Acquired the Artwork"
        testID="Consignment_ProvenanceInput"
        value={values.provenance}
        onChangeText={(e) => setFieldValue("provenance", e)}
        multiline
      />
      <InfoModal
        title="Artwork Provenance"
        visible={isProvenanceInfoModalVisible}
        onDismiss={() => setIsProvenanceInfoModalVisible(false)}
      >
        <Flex mb={4}>
          <Text>
            Provenance is the documented history of an artwork’s ownership and authenticity. Please list any
            documentation you have that proves your artwork’s provenance, such as:
          </Text>
        </Flex>

        <Flex flexDirection="column">
          <Text> • Invoices from previous owners</Text>
          <Text> • Certificates of authenticity</Text>
          <Text> • Gallery exhibition catalogues</Text>
        </Flex>
      </InfoModal>

      <Spacer mt={2} />
      <LocationAutocomplete onChange={(e: Location) => setFieldValue("location", e)} />
    </Flex>
  )
}
