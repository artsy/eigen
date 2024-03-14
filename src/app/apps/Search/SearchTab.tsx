import { SearchScreen } from "app/Scenes/Search/Search"
import { ScreenPadding } from "app/system/newNavigation/ScreenPadding"

export const SearchTab = () => {
  return (
    <ScreenPadding fullBleed={false} isPresentedModally={false} isVisible={true}>
      <SearchScreen />
    </ScreenPadding>
  )
}
