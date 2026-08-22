import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { MapRenderer } from "app/Scenes/Map/MapRenderer"

interface CityGuideProps {
  citySlug?: string
}

export const CityGuide: React.FC<CityGuideProps> = ({ citySlug }) => {
  const initialCitySlug = useInitialLocation(citySlug)

  return <MapRenderer citySlug={initialCitySlug} />
}
