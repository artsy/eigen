import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"

export const CityGuide: React.FC = () => {
  const initialCitySlug = useInitialLocation()

  return <CityGuideMapQueryRenderer citySlug={initialCitySlug} />
}
