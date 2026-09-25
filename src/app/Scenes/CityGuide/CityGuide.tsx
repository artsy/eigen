import { LoadFailureView } from "app/Components/LoadFailureView"
import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { useCityGuideCities } from "app/Scenes/CityGuide/hooks/useCityGuideCities"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"

interface CityGuideProps {
  citySlug?: string
}

const CityGuideWithCities: React.FC<CityGuideProps> = ({ citySlug }) => {
  const cities = useCityGuideCities()
  const initialCitySlug = useInitialLocation(cities, citySlug)

  return <CityGuideMapQueryRenderer citySlug={initialCitySlug} cities={cities} />
}

export const CityGuide = withSuspense<CityGuideProps>({
  Component: CityGuideWithCities,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView
      error={fallbackProps.error}
      onRetry={fallbackProps.resetErrorBoundary}
      showBackButton
    />
  ),
})
