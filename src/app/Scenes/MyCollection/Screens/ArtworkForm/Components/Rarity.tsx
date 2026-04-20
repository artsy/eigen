import { Flex, Text, Input, InputRef } from "@artsy/palette-mobile"
import { INPUT_HEIGHT } from "app/Components/Input"
import { Select, SelectRef } from "app/Components/Select"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import React, { Ref, useRef, useState } from "react"
import { InteractionManager } from "react-native"
import { AttributionClassType, RarityInfoModal } from "./RarityLegacy"

interface RarityProps {
  selectRef?: Ref<SelectRef>
  onSubmitEditing?: () => void
}

export const Rarity: React.FC<RarityProps> = ({ selectRef, onSubmitEditing }) => {
  const { formik } = useArtworkForm()
  const [isRarityInfoModalVisible, setRarityInfoModalVisible] = useState(false)

  const editionRef = useRef<InputRef>(null)
  const editionSizeRef = useRef<InputRef>(null)

  const handleValueChange = (value: AttributionClassType) => {
    formik.handleChange("attributionClass")(value)
    if (value !== "UNIQUE") {
      // Unset edition number and size if not unique
      formik.setFieldValue("editionNumber", undefined)
      formik.setFieldValue("editionSize", undefined)
    }
    // TODO: `InteractionManager` is deprecated
    // we need to update it to `requestIdleCallback` when we upgrade to RN 0.82+
    InteractionManager.runAfterInteractions(() => {
      if (value === "LIMITED_EDITION") {
        editionRef.current?.focus()
      } else {
        onSubmitEditing?.()
      }
    })
  }

  return (
    <>
      <Select
        ref={selectRef}
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
                ref={editionRef}
                accessibilityLabel="Edition number input"
                title="Edition number"
                onChangeText={formik.handleChange("editionNumber")}
                onBlur={formik.handleBlur("editionNumber")}
                value={formik.values.editionNumber}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => editionSizeRef.current?.focus()}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="center" mx={2} height={INPUT_HEIGHT}>
            <Text>/</Text>
          </Flex>
          <Flex flex={1}>
            <Flex>
              <Input
                ref={editionSizeRef}
                title="Edition size"
                onChangeText={formik.handleChange("editionSize")}
                onBlur={formik.handleBlur("editionSize")}
                value={formik.values.editionSize}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onSubmitEditing}
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
