import { Join, Screen, Spacer } from "@artsy/palette-mobile"
import { CityGuideNewQuery } from "__generated__/CityGuideNewQuery.graphql"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityData, CityGuideCityPicker } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideEventGuides } from "app/Scenes/CityGuide/Components/CityGuideEventGuides"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { CityGuideFloatingMapButton } from "app/Scenes/CityGuide/Components/CityGuideFloatingMapButton"
import { CityGuideItinerariesRail } from "app/Scenes/CityGuide/Components/CityGuideItinerariesRail"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback, useState } from "react"
import { RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import expandedCities from "../../../../data/cityDataSortedByDisplayPreference-expanded.json"

const cities = expandedCities as CityData[]
const fallbackCity = cities.find((city) => city.slug === "new-york-ny-usa") as CityData

/** Well above the number of rows any one of the three sections shows on the home screen. */
const PAGE_SIZE = 10

interface SectionsProps {
  citySlug: string
  cityName: string
}

const CityGuideNewSections: React.FC<SectionsProps> = ({ citySlug, cityName }) => {
  const data = useLazyLoadQuery<CityGuideNewQuery>(Query, { citySlug, first: PAGE_SIZE })

  return (
    <Join separator={<Spacer y={4} />}>
      <>
        <CityGuideItinerariesRail citySlug={citySlug} me={data.me} />

        <CityGuideEventGuides citySlug={citySlug} city={data.city} query={data} />
      </>

      <CityGuideEvents citySlug={citySlug} cityName={cityName} city={data.city} />
    </Join>
  )
}

const CityGuideNewSectionsWithSuspense = withSuspense({
  Component: CityGuideNewSections,
  // The sections sit mid-scroll on the home screen, so they stay absent until they have data
  // rather than reserving space and shifting everything below.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})

export const CityGuideNew: React.FC = () => {
  const [showCityPicker, setShowCityPicker] = useState(false)

  // Same order the map's City Guide uses: where you were last, else nearest, else New York.
  const initialCitySlug = useInitialLocation()
  const [city, setCity] = useState<CityData>(
    () => cities.find((option) => option.slug === initialCitySlug) ?? fallbackCity
  )

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const citySlug = city?.slug ?? ""

  /*
    Refetched via `fetchQuery`, not by bumping fetchKey — a network-only re-render would
    suspend the whole screen and blank all three sections mid-pull instead of updating them
    in place (same pattern as `ItineraryScreen.tsx`'s own pull to refresh).
  */
  const refresh = useCallback(() => {
    setIsRefreshing(true)

    fetchQuery<CityGuideNewQuery>(
      environment,
      Query,
      { citySlug, first: PAGE_SIZE },
      { fetchPolicy: "network-only" }
    ).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    })
  }, [environment, citySlug])

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    setCity(newCity)
    GlobalStore.actions.userPrefs.setPreviouslySelectedCitySlug(newCity.slug)
  }

  return (
    <AddToItineraryProvider citySlug={citySlug} cityName={city?.name ?? ""} onSaved={refresh}>
      <Screen>
        <Screen.AnimatedHeader
          title={city?.name ?? ""}
          rightElements={
            <CityGuideCitySwitcherButton
              cityName={city?.name ?? ""}
              onPress={() => {
                setShowCityPicker(true)
              }}
            />
          }
          onBack={goBack}
          hideTitle
        />

        <Screen.Body fullwidth>
          <Screen.ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
          >
            <CityGuideCityPicker
              showCityPicker={showCityPicker}
              setShowCityPicker={setShowCityPicker}
              selectedCity={city?.name ?? ""}
              onSelectCity={onSelectCity}
            />

            <CityGuideNewSectionsWithSuspense citySlug={citySlug} cityName={city?.name ?? ""} />
          </Screen.ScrollView>

          <CityGuideFloatingMapButton cityName={city?.name ?? ""} citySlug={citySlug} />
        </Screen.Body>
      </Screen>
    </AddToItineraryProvider>
  )
}

const Query = graphql`
  query CityGuideNewQuery($citySlug: String!, $first: Int!) {
    me {
      ...CityGuideItinerariesRail_me @arguments(citySlug: $citySlug, first: $first)
    }
    city(slug: $citySlug) {
      ...CityGuideEventGuides_city @arguments(first: $first)
      ...CityGuideEvents_city @arguments(first: $first)
    }
    ...CityGuideEventGuides_query @arguments(citySlug: $citySlug, first: $first)
  }
`
