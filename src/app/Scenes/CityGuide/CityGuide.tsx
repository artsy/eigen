import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { MapRenderer } from "app/Scenes/Map/MapRenderer"

export const CityGuide: React.FC = () => {
  const initialCitySlug = useInitialLocation()

  return <MapRenderer citySlug={initialCitySlug} />
}
