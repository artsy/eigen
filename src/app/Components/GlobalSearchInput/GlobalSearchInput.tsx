import { Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
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
        {/* In order to make the search input behave like a button here, we wrapped it with a
         Touchable and set pointerEvents to none. This will prevent the input from receiving
         touch events and make sure they are being handled by the Touchable.
        */}
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
