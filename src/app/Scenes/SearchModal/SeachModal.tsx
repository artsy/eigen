import { Flex, RoundSearchInput, Screen, Spacer } from "@artsy/palette-mobile"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
import { goBack } from "app/system/navigation/navigate"

export const SearchModalScreen = () => {
  return (
    <Screen>
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
            goBack()
          }}
        />
      </Flex>
      <Spacer y={2} />

      <Flex flex={1} backgroundColor="black10" />
    </Screen>
  )
}
