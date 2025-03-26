import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface SortOption {
  value: string
  text: string
}

export interface AlertsSortByModalProps {
  visible: boolean
  options: SortOption[]
  selectedValue: string
  onSelectOption: (selectedOption: SortOption) => void
  onModalFinishedClosing: () => void
}

export const AlertsSortByModal: React.FC<AlertsSortByModalProps> = (props) => {
  const { visible, options, selectedValue, onSelectOption, onModalFinishedClosing } = props

  const { bottom } = useSafeAreaInsets()

  return (
    <AutomountedBottomSheetModal
      visible={visible}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing
      onDismiss={() => {
        onModalFinishedClosing()
      }}
      name="SortByBottomSheet"
    >
      <BottomSheetScrollView keyboardShouldPersistTaps="always">
        <Flex p={2}>
          <Text variant="lg-display" mb={1}>
            Sort By
          </Text>
          <Spacer y={2} />

          <Join separator={<Spacer y={2} />}>
            {options.map((option: SortOption) => (
              <RadioButton
                key={option.value}
                onPress={() => onSelectOption(option)}
                selected={selectedValue === option.value}
                text={option.text}
              />
            ))}
          </Join>
        </Flex>

        {/* This is a spacer to make sure the bottom sheet is not covered by the system bottom insets */}
        <Spacer y={`${bottom}px`} />
      </BottomSheetScrollView>
    </AutomountedBottomSheetModal>
  )
}
