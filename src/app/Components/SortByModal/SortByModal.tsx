import { Flex, RadioDot, Text } from "@artsy/palette-mobile"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { TouchableRow } from "app/Components/TouchableRow"
import { Modal } from "react-native"

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

export const SortByModal: React.FC<SortByModalProps> = (props) => {
  const { visible, options, selectedValue, onCloseModal, onSelectOption, onModalFinishedClosing } =
    props

  return (
    <Modal
      visible={visible}
      onRequestClose={onCloseModal}
      onDismiss={onModalFinishedClosing}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <Flex height={250} width="100%">
        <NavigationHeader useXButton onLeftButtonPress={onCloseModal}>
          Sort By
        </NavigationHeader>
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
      </Flex>
    </Modal>
  )
}
