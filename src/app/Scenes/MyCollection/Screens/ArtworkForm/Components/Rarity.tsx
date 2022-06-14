import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import { Flex, Input, INPUT_HEIGHT, InputTitle, Separator, Text } from "palette"
import { Select } from "palette/elements/Select"
import React, { useState } from "react"

type AttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION"

export const Rarity: React.FC = () => {
  const { formik } = useArtworkForm()
  const [isRarityInfoModalVisible, setRarityInfoModalVisible] = useState(false)

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
        tooltipText="What is this?"
        onTooltipPress={() => setRarityInfoModalVisible(true)}
        options={artworkRarityClassifications}
        testID="rarity-select"
      />
      {formik.values.attributionClass === "LIMITED_EDITION" && (
        <Flex flexDirection="row" mt="2" alignItems="flex-end">
          <Flex flex={1}>
            <Flex>
              <Input
                title="Edition number"
                keyboardType="decimal-pad"
                onChangeText={formik.handleChange("editionNumber")}
                onBlur={formik.handleBlur("editionNumber")}
                value={formik.values.editionNumber}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="center" mx={2} height={INPUT_HEIGHT}>
            <Text>/</Text>
          </Flex>
          <Flex flex={1}>
            <Flex>
              <Input
                title="Edition size"
                keyboardType="decimal-pad"
                onChangeText={formik.handleChange("editionSize")}
                onBlur={formik.handleBlur("editionSize")}
                value={formik.values.editionSize}
              />
            </Flex>
          </Flex>
        </Flex>
      )}
      <RarityInfoModal
        title="Classifications"
        visible={isRarityInfoModalVisible}
        onDismiss={() => setRarityInfoModalVisible(false)}
      />
    </>
  )
}

const RarityInfoModal: React.FC<{
  title: string
  visible: boolean
  onDismiss(): any
}> = ({ title, visible, onDismiss }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <FancyModalHeader onLeftButtonPress={onDismiss} useXButton>
        {title}
      </FancyModalHeader>
      <Separator />
      <Flex m={2}>
        {artworkRarityClassifications.map((classification) => (
          <Flex mb={2} key={classification.label}>
            <InputTitle>{classification.label}</InputTitle>
            <Text>{classification.description}</Text>
          </Flex>
        ))}
      </Flex>
    </FancyModal>
  )
}
