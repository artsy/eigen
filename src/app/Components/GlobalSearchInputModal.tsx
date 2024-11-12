import { Flex, RoundSearchInput, Spacer } from "@artsy/palette-mobile"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
import { Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const GlobalSearchInputModal: React.FC<{ visible: boolean; hideModal: () => void }> = ({
  visible,
  hideModal,
}) => {
  return (
    <Modal visible={visible} animationType="fade">
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <Flex px={2} pt={2}>
          <RoundSearchInput
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            accessibilityHint="Search artists, artworks, galleries etc."
            accessibilityLabel="Search artists, artworks, galleries etc."
            maxLength={55}
            numberOfLines={1}
            autoFocus
            multiline={false}
            onLeftIconPress={() => {
              hideModal()
            }}
          />
        </Flex>
        <Spacer y={2} />
        <Flex flex={1} backgroundColor="black10" />
      </SafeAreaView>
    </Modal>
  )
}
