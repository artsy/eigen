import { Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInputOverlay"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
import { Fragment, useState } from "react"

export const GlobalSearchInput: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Fragment>
      <Touchable
        onPress={() => {
          setIsVisible(true)
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
      <GlobalSearchInputOverlay visible={isVisible} hideModal={() => setIsVisible(false)} />
    </Fragment>
  )
}
