import { Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { GlobalSearchInputModal } from "app/Components/GlobalSearchInputModal"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
import { navigate } from "app/system/navigation/navigate"
import { Fragment, useState } from "react"

export const GlobalSearchInput: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <Fragment>
      <Touchable
        onPress={() => {
          navigate("search/modal")
        }}
      >
        <Flex pointerEvents="none">
          <RoundSearchInput
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            accessibilityHint="Search artists, artworks, galleries etc."
            accessibilityLabel="Search artists, artworks, galleries etc."
            maxLength={55}
            numberOfLines={1}
            multiline={false}
          />
        </Flex>
      </Touchable>
      <GlobalSearchInputModal visible={isVisible} hideModal={() => setIsVisible(false)} />
    </Fragment>
  )
}
