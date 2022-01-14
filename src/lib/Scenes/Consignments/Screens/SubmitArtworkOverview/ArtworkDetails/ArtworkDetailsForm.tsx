import { useFormikContext } from "formik"
import { Box, Flex, Input, InputTitle, RadioButton, Spacer, Text } from "palette"
import { Select } from "palette/elements/Select"
import React, { useState } from "react"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { InfoModal } from "./Components/InfoModal"
import { rarityOptions } from "./utils/rarityOptions"
export interface ArtworkDetailsFormModel {
  artist: string
  artistId: string
  title: string
  year: string
  materials: string
  rarity: string
  height: string
  width: string
  depth: string
  provenance: string
  location: string
}

export const ArtworkDetailsForm: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()

  const [isRarityInfoModalVisible, setRarityInfoModalVisible] = useState(false)
  const [isProvenanceInfoModalVisible, setProvenanceInfoModalVisible] = useState(false)

  return (
    <Flex flexDirection="column">
      <Spacer mt={2} />
      <InputTitle>Artist</InputTitle>
      <ArtistAutosuggest />
      <Spacer mt={2} />
      <Input
        title="Title"
        placeholder="Add Title or Write 'Unknown'"
        value={values.title}
        onChangeText={(e) => setFieldValue("title", e)}
      />
      <Spacer mt={2} />
      <Input title="Year" placeholder="YYYY" value={values.year} onChangeText={(e) => setFieldValue("year", e)} />

      <Spacer mt={2} />
      <Input
        title="Materials"
        placeholder="Oil on Canvas, Mixed Media, Lithograph.."
        value={values.materials}
        onChangeText={(e) => setFieldValue("materials", e)}
      />
      <Spacer mt={2} />
      <Select
        onSelectValue={(e) => setFieldValue("rarity", e)}
        value={values.rarity}
        enableSearch={false}
        title="Rarity"
        tooltipText="What is this?"
        onTooltipPress={() => setRarityInfoModalVisible(true)}
        placeholder="Select a Classification"
        options={rarityOptions}
      />
      <InfoModal
        title="Classifications"
        visible={isRarityInfoModalVisible}
        isRarity
        onDismiss={() => setRarityInfoModalVisible(false)}
      />
      <Spacer mt={2} />
      <InputTitle>Dimensions</InputTitle>
      <Spacer mt={1} />
      <Flex flexDirection="row">
        <RadioButton mr={2} text="in" selected />
        <RadioButton text="cm" />
      </Flex>
      <Spacer mt={2} />
      <Flex flexDirection="row">
        <Box width="31%" mr={1}>
          <Input title="Height" value={values.height} onChangeText={(e) => setFieldValue("height", e)} />
        </Box>
        <Box width="31%" mr={1}>
          <Input title="Width" value={values.width} onChangeText={(e) => setFieldValue("width", e)} />
        </Box>
        <Box width="31%" mr={1}>
          <Input title="Depth" value={values.depth} onChangeText={(e) => setFieldValue("depth", e)} />
        </Box>
      </Flex>
      <Spacer mt={2} />
      <Flex flexDirection="row" justifyContent="space-between">
        <InputTitle>Provenance</InputTitle>
        <Text variant="xs" color="black60" onPress={() => setProvenanceInfoModalVisible(true)}>
          What is this?
        </Text>
      </Flex>
      <Input
        placeholder="Describe How You Acquired the Artwork"
        value={values.provenance}
        onChangeText={(e) => setFieldValue("provenance", e)}
        multiline
      />
      <InfoModal
        title="Artwork Provenance"
        visible={isProvenanceInfoModalVisible}
        isRarity={false}
        onDismiss={() => setProvenanceInfoModalVisible(false)}
      />
      <Spacer mt={2} />
      {/* TODO: location autocomplete */}
      <Input
        title="Location"
        placeholder="Enter City Where Artwork Is Located"
        value={values.location}
        onChangeText={(e) => setFieldValue("location", e)}
      />
    </Flex>
  )
}
