import { CityGuide as CityGuideNew } from "app/Scenes/CityGuide/CityGuideNew"
import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const CityGuide: React.FC = () => {
  const showGlobalMapList = useFeatureFlag("AREnableGlobalMapList")

  const initialCitySlug = useInitialLocation()

  if (showGlobalMapList) {
    return <CityGuideNew />
  }

  return <CityGuideMapQueryRenderer citySlug={initialCitySlug} />
}
