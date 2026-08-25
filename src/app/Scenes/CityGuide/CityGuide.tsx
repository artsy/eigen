import { CityGuide as CityGuideNew } from "app/Scenes/CityGuide/CityGuideNew"
import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface CityGuideProps {
  citySlug?: string
}

export const CityGuide: React.FC<CityGuideProps> = ({ citySlug }) => {
  const showGlobalMapList = useFeatureFlag("AREnableGlobalMapList")

  const initialCitySlug = useInitialLocation(citySlug)

  if (showGlobalMapList) {
    return <CityGuideNew />
  }

  return <CityGuideMapQueryRenderer citySlug={initialCitySlug} />
}
