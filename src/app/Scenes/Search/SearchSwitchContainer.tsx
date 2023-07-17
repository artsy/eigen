import { SearchScreen } from "app/Scenes/Search/Search"
import { SearchScreen2 } from "app/Scenes/Search/Search2"

export const SearchSwitchContainer: React.FC = () => {
  const renderESOnlySearch = true
  return renderESOnlySearch ? <SearchScreen2 /> : <SearchScreen />
}
