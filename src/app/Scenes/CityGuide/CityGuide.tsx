import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { CityGuideCitiesLoadFailure } from "app/Scenes/CityGuide/Components/CityGuideCitiesLoadFailure"
import { CityGuideMapQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer"
import { useCityGuideCities } from "app/Scenes/CityGuide/hooks/useCityGuideCities"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"

interface CityGuideProps {
  citySlug?: string
}

const CityGuideWithCities: React.FC<CityGuideProps> = ({ citySlug }) => {
  const cities = useCityGuideCities()
  const initialCitySlug = useInitialLocation(cities, citySlug)

  return <CityGuideMapQueryRenderer citySlug={initialCitySlug} cities={cities} />
}

// The route hides the navigation header, so the loading state brings its own back button.
const CityGuideLoading: React.FC = () => (
  <Screen>
    <Screen.Header onBack={goBack} />
    <Screen.Body>
      <Flex flex={1} justifyContent="center" alignItems="center" testID="city-guide-loading">
        <Spinner />
      </Flex>
    </Screen.Body>
  </Screen>
)

export const CityGuide = withSuspense<CityGuideProps>({
  Component: CityGuideWithCities,
  LoadingFallback: CityGuideLoading,
  ErrorFallback: (fallbackProps) => <CityGuideCitiesLoadFailure {...fallbackProps} />,
})
