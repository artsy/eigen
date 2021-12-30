import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkRarityClassifications } from "lib/utils/artworkRarityClassifications"
import { CloseIcon, Flex, Input, INPUT_HEIGHT, Separator, Text } from "palette"
import { Select } from "palette/elements/Select"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"

export type AttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION"

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
      <RarityClassifcationTypesModal
        title="Classifications"
        visible={isRarityInfoModalVisible}
        onDismiss={() => setRarityInfoModalVisible(false)}
      />
    </>
  )
}

const RarityClassifcationTypesModal: React.FC<{
  title: string
  visible: boolean
  onDismiss(): any
}> = ({ title, visible, onDismiss }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <Flex p="2" pb={15} flexDirection="row" alignItems="center" flexGrow={0}>
        <Flex flex={1} />
        <Flex flex={2} alignItems="center">
          <Text>{title}</Text>
        </Flex>
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          style={{ flex: 1, alignItems: "flex-end" }}
        >
          <CloseIcon fill="black60" />
        </TouchableOpacity>
      </Flex>
      <Separator />
      <Flex m={2}>
        {artworkRarityClassifications.map((classification) => (
          <Flex mb={2} key={classification.label}>
            <Text variant="md" style={{ fontSize: 13, marginBottom: 2, textTransform: "uppercase" }}>
              {classification.label}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 2 }}>{classification.description}</Text>
          </Flex>
        ))}
      </Flex>
    </FancyModal>
  )
}
