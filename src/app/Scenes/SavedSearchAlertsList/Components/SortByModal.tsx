import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { TouchableRow } from "app/Components/TouchableRow"
import { Flex, RadioDot, Text } from "palette"
import React, { FC } from "react"

export interface SortOption {
  value: string
  text: string
}

export interface SortByModalProps {
  visible: boolean
  options: SortOption[]
  selectedValue: string
  onCloseModal: () => void
  onSelectOption: (selectedOption: SortOption) => void
  onModalFinishedClosing: () => void
}

export const SortByModal: FC<SortByModalProps> = (props) => {
  const { visible, options, selectedValue, onCloseModal, onSelectOption, onModalFinishedClosing } =
    props

  return (
    <FancyModal
      visible={visible}
      maxHeight={250}
      onBackgroundPressed={onCloseModal}
      onModalFinishedClosing={onModalFinishedClosing}
    >
      <FancyModalHeader useXButton onLeftButtonPress={onCloseModal}>
        Sort By
      </FancyModalHeader>
      {options.map((option) => {
        const selected = selectedValue === option.value

        return (
          <TouchableRow
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onSelectOption(option)}
          >
            <Flex flexDirection="row" p={2} alignItems="center" justifyContent="space-between">
              <Flex flex={1} mr={1}>
                <Text numberOfLines={2}>{option.text}</Text>
              </Flex>
              <RadioDot selected={selected} />
            </Flex>
          </TouchableRow>
        )
      })}
    </FancyModal>
  )
}
