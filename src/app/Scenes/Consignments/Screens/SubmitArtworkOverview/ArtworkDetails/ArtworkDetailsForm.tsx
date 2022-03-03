import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import { useFormikContext } from "formik"
import {
  Box,
  BulletedItem,
  Flex,
  Input,
  InputTitle,
  LinkButton,
  RadioButton,
  Spacer,
  Text,
} from "palette"
import { Select } from "palette/elements/Select"
import React, { useState } from "react"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { InfoModal } from "./Components/InfoModal"
import { LocationAutocomplete } from "./Components/LocationAutocomplete"
import { rarityOptions } from "./utils/rarityOptions"
import { limitedEditionValue } from "./utils/rarityOptions"
import { ArtworkDetailsFormModel, Location } from "./validation"

const StandardSpace = () => <Spacer mt={4} />

export const ArtworkDetailsForm: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()
  const [isRarityInfoModalVisible, setIsRarityInfoModalVisible] = useState(false)
  const [isProvenanceInfoModalVisible, setIsProvenanceInfoModalVisible] = useState(false)

  return (
    <>
      <ArtistAutosuggest />
      <StandardSpace />
      <Input
        title="Title"
        placeholder="Add Title or Write 'Unknown'"
        testID="Submission_TitleInput"
        value={values.title}
        onChangeText={(e) => setFieldValue("title", e)}
      />
      <StandardSpace />
      <Input
        title="Year"
        placeholder="YYYY"
        testID="Submission_YearInput"
        value={values.year}
        onChangeText={(e) => setFieldValue("year", e)}
      />
      <StandardSpace />
      <Input
        title="Materials"
        placeholder="Oil on Canvas, Mixed Media, Lithograph.."
        testID="Submission_MaterialsInput"
        value={values.medium}
        onChangeText={(e) => setFieldValue("medium", e)}
      />
      <StandardSpace />
      <Select
        onSelectValue={(e) => setFieldValue("attributionClass", e)}
        value={values.attributionClass}
        enableSearch={false}
        title="Rarity"
        tooltipText={
          <LinkButton variant="xs" color="black60">
            What is this?
          </LinkButton>
        }
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
                testID="Submission_EditionNumberInput"
                value={values.editionNumber}
                onChangeText={(e) => setFieldValue("editionNumber", e)}
              />
            </Box>
            <Box width="48%">
              <Input
                title="Edition Size"
                testID="Submission_EditionSizeInput"
                value={values.editionSizeFormatted}
                onChangeText={(e) => setFieldValue("editionSizeFormatted", e)}
              />
            </Box>
          </Flex>
        </>
      )}
      <StandardSpace />
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
            testID="Submission_HeightInput"
            value={values.height}
            onChangeText={(e) => setFieldValue("height", e)}
          />
        </Box>
        <Box width="31%" mr={1}>
          <Input
            title="Width"
            testID="Submission_WidthInput"
            value={values.width}
            onChangeText={(e) => setFieldValue("width", e)}
          />
        </Box>
        <Box width="31%">
          <Input
            title="Depth"
            testID="Submission_DepthInput"
            value={values.depth}
            onChangeText={(e) => setFieldValue("depth", e)}
          />
        </Box>
      </Flex>
      <StandardSpace />
      <Flex flexDirection="row" justifyContent="space-between">
        <InputTitle>Provenance</InputTitle>
        <LinkButton
          variant="xs"
          color="black60"
          onPress={() => setIsProvenanceInfoModalVisible(true)}
        >
          What is this?
        </LinkButton>
      </Flex>
      <Input
        placeholder="Describe How You Acquired the Artwork"
        testID="Submission_ProvenanceInput"
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
            Provenance is the documented history of an artwork’s ownership and authenticity. Please
            list any documentation you have that proves your artwork’s provenance, such as:
          </Text>
        </Flex>

        <Flex flexDirection="column">
          <BulletedItem color="black">Invoices from previous owners</BulletedItem>
          <BulletedItem color="black">Certificates of authenticity</BulletedItem>
          <BulletedItem color="black">Gallery exhibition catalogues</BulletedItem>
        </Flex>
      </InfoModal>
      <StandardSpace />
      <LocationAutocomplete
        initialLocation={values.location}
        onChange={(e: Location) => setFieldValue("location", e)}
      />
      <StandardSpace />
    </>
  )
}
