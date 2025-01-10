import { Flex, Separator, Text } from "@artsy/palette-mobile"
import { Input, INPUT_HEIGHT, InputTitle } from "app/Components/Input"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { Select } from "app/Components/Select"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import React, { useState } from "react"
import { Modal } from "react-native"

export type AttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION"

export const Rarity: React.FC = () => {
  const { formik } = useArtworkForm()
  const [isRarityInfoModalVisible, setRarityInfoModalVisible] = useState(false)

  const handleValueChange = (value: AttributionClassType) => {
    formik.handleChange("attributionClass")(value)
    if (value !== "UNIQUE") {
      // Unset edition number and size if not unique
      formik.setFieldValue("editionNumber", undefined)
      formik.setFieldValue("editionSize", undefined)
    }
  }

  return (
    <>
      <Select
        onSelectValue={handleValueChange}
        value={formik.values.attributionClass}
        enableSearch={false}
        title="Rarity"
        placeholder="Select"
        tooltipText="What's this?"
        onTooltipPress={() => setRarityInfoModalVisible(true)}
        options={artworkRarityClassifications}
        testID="rarity-select"
      />
      {formik.values.attributionClass === "LIMITED_EDITION" && (
        <Flex flexDirection="row" mt={2} alignItems="flex-end">
          <Flex flex={1}>
            <Flex>
              <Input
                accessibilityLabel="Edition number input"
                title="Edition number"
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

export const RarityInfoModal: React.FC<{
  title: string
  visible: boolean
  onDismiss(): any
}> = ({ title, visible, onDismiss }) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onDismiss}
      testID="RarityInfoModal"
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <NavigationHeader onLeftButtonPress={onDismiss} useXButton>
        {title}
      </NavigationHeader>
      <Separator />
      <Flex m={2}>
        {artworkRarityClassifications.map((classification) => (
          <Flex mb={2} key={classification.label}>
            <InputTitle>{classification.label}</InputTitle>
            <Text>{classification.description}</Text>
          </Flex>
        ))}
      </Flex>
    </Modal>
  )
}
