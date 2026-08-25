import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"

interface CityGuideProps {
  citySlug?: string
}

export const CityGuide: React.FC<CityGuideProps> = ({ citySlug }) => {
  const initialCitySlug = useInitialLocation(citySlug)

  return <CityGuideMapQueryRenderer citySlug={initialCitySlug} />
}
