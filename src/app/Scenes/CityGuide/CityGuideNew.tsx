import { OwnerType } from "@artsy/cohesion"
import { Join, Screen, Spacer, Theme } from "@artsy/palette-mobile"
import { CityGuideNewQuery } from "__generated__/CityGuideNewQuery.graphql"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityGuideCitiesLoadFailure } from "app/Scenes/CityGuide/Components/CityGuideCitiesLoadFailure"
import { CityData, CityGuideCityPicker } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideEventArticles } from "app/Scenes/CityGuide/Components/CityGuideEventArticles"
import { CityGuideEventGuides } from "app/Scenes/CityGuide/Components/CityGuideEventGuides"
import { CityGuideEventVideos } from "app/Scenes/CityGuide/Components/CityGuideEventVideos"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { CityGuideFloatingMapButton } from "app/Scenes/CityGuide/Components/CityGuideFloatingMapButton"
import { CityGuideItinerariesRail } from "app/Scenes/CityGuide/Components/CityGuideItinerariesRail"
import { CityGuideNewPlaceholder } from "app/Scenes/CityGuide/Components/CityGuideNewPlaceholder"
import { useCityGuideCities } from "app/Scenes/CityGuide/hooks/useCityGuideCities"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { useShowsForYou } from "app/Scenes/CityGuide/hooks/useShowsForYou"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useCallback, useState } from "react"
import { RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

/** Well above the number of rows any one of the three sections shows on the home screen. */
const PAGE_SIZE = 10

interface SectionsProps {
  citySlug: string
  cityName: string
}

const CityGuideNewSections: React.FC<SectionsProps> = ({ citySlug, cityName }) => {
  const forYou = useShowsForYou()
  const enableEditorialContent = useFeatureFlag("AREnableCityGuideEditorialContent")
  const enableArticlesForYou = useFeatureFlag("AREnableCityGuideArticlesForYou")
  const data = useLazyLoadQuery<CityGuideNewQuery>(Query, {
    citySlug,
    first: PAGE_SIZE,
    forYou,
    enableArticlesForYou,
  })

  return (
    <Join separator={<Spacer y={4} />}>
      <>
        <CityGuideItinerariesRail citySlug={citySlug} me={data.me} />

        {/* Always light: the block is styled as a black card, which flips its palette tokens in dark mode. */}
        <Theme theme="v3light">
          <CityGuideEventGuides citySlug={citySlug} query={data} />
        </Theme>
      </>

      <CityGuideEvents citySlug={citySlug} cityName={cityName} city={data.city} />

      {/*
        Both sections come from the event the guides above belong to, but sit at the bottom of
        the screen rather than inside that dark block, which is where the designs put them.
        `Join` drops falsy children, so the flag being off leaves no stray separator behind.
      */}
      {!!enableEditorialContent && <CityGuideEventVideos city={data.city} />}

      {!!enableEditorialContent && <CityGuideEventArticles citySlug={citySlug} city={data.city} />}
    </Join>
  )
}

const CityGuideNewSectionsWithSuspense = withSuspense({
  Component: CityGuideNewSections,
  // A spinner, so the initial load doesn't blank the screen outright.
  LoadingFallback: CityGuideNewPlaceholder,
  ErrorFallback: NoFallback,
})

interface CityGuideNewProps {
  citySlug?: string
}

const CityGuideNewWithCities: React.FC<CityGuideNewProps> = ({ citySlug: preselectedCitySlug }) => {
  const cities = useCityGuideCities()
  const fallbackCity = cities.find((city) => city.slug === "new-york-ny-usa") ?? cities[0]

  const [showCityPicker, setShowCityPicker] = useState(false)

  // Same order the map's City Guide uses: preselected via URL, else where you were last, else
  // nearest, else New York.
  const initialCitySlug = useInitialLocation(cities, preselectedCitySlug)
  const [city, setCity] = useState<CityData>(
    () => cities.find((option) => option.slug === initialCitySlug) ?? fallbackCity
  )

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const forYou = useShowsForYou()
  const enableArticlesForYou = useFeatureFlag("AREnableCityGuideArticlesForYou")

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
      { citySlug, first: PAGE_SIZE, forYou, enableArticlesForYou },
      { fetchPolicy: "network-only" }
    ).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    })
  }, [environment, citySlug, forYou, enableArticlesForYou])

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    setCity(newCity)
    GlobalStore.actions.userPrefs.setPreviouslySelectedCitySlug(newCity.slug)
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.cityGuide,
        context_screen_owner_slug: citySlug,
      })}
    >
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
                isListView
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
                cities={cities}
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
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

// The route hides the navigation header, so the loading state brings its own back button.
const CityGuideNewLoading: React.FC = () => (
  <Screen>
    <Screen.Header onBack={goBack} />
    <Screen.Body fullwidth>
      <CityGuideNewPlaceholder />
    </Screen.Body>
  </Screen>
)

export const CityGuideNew = withSuspense<CityGuideNewProps>({
  Component: CityGuideNewWithCities,
  LoadingFallback: CityGuideNewLoading,
  ErrorFallback: (fallbackProps) => <CityGuideCitiesLoadFailure {...fallbackProps} />,
})

const Query = graphql`
  query CityGuideNewQuery(
    $citySlug: String!
    $first: Int!
    $forYou: Boolean!
    $enableArticlesForYou: Boolean!
  ) {
    me {
      ...CityGuideItinerariesRail_me @arguments(citySlug: $citySlug, first: $first)
    }
    city(slug: $citySlug) {
      ...CityGuideEvents_city @arguments(first: $first, forYou: $forYou)
      ...CityGuideEventVideos_city
      ...CityGuideEventArticles_city @arguments(enableArticlesForYou: $enableArticlesForYou)
    }
    ...CityGuideEventGuides_query @arguments(citySlug: $citySlug, first: $first)
  }
`
