import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { SearchScreen } from "app/Scenes/Search/Search"

export const SearchTab = () => {
  const topInset = useScreenDimensions().safeAreaInsets.top
  // TODO: Nav bar background color is gray?
  return (
    <Flex style={{ flex: 1, backgroundColor: "white", marginTop: topInset }}>
      <SearchScreen />
    </Flex>
  )
}
