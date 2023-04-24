import { SearchScreen } from "app/Scenes/Search/Search"
import { SearchScreen2 } from "app/Scenes/Search/Search2"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

// The purpose of this screen is to decide which search screen to render
// depending on the value of AREnableESOnlySearch feature flag.
export const SearchSwitchContainer: React.FC = () => {
  const renderESOnlySearch = useFeatureFlag("AREnableESOnlySearch")
  return renderESOnlySearch ? <SearchScreen2 /> : <SearchScreen />
}
