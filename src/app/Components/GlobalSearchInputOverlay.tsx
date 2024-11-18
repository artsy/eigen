import { Flex, RoundSearchInput, Spacer } from "@artsy/palette-mobile"
import { Portal } from "@gorhom/portal"
import { FadeIn } from "app/Components/FadeIn"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const GlobalSearchInputOverlay: React.FC<{ visible: boolean; hideModal: () => void }> = ({
  visible,
  hideModal,
}) => {
  if (!visible) {
    return null
  }

  return (
    <Portal hostName="SearchOverlay">
      <FadeIn style={StyleSheet.absoluteFillObject} slide={false}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "white" }}
          edges={["top", "left", "right"]}
        >
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
      </FadeIn>
    </Portal>
  )
}
