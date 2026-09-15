import { Join, Screen, Spacer } from "@artsy/palette-mobile"
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
import { useState } from "react"
import expandedCities from "../../../../data/cityDataSortedByDisplayPreference-expanded.json"

const cities = expandedCities as CityData[]
const fallbackCity = cities.find((city) => city.slug === "new-york-ny-usa") as CityData

export const CityGuideNew: React.FC = () => {
  const [showCityPicker, setShowCityPicker] = useState(false)

  // Same order the map's City Guide uses: where you were last, else nearest, else New York.
  const initialCitySlug = useInitialLocation()
  const [city, setCity] = useState<CityData>(
    () => cities.find((option) => option.slug === initialCitySlug) ?? fallbackCity
  )

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    setCity(newCity)
    GlobalStore.actions.userPrefs.setPreviouslySelectedCitySlug(newCity.slug)
  }

  return (
    <AddToItineraryProvider citySlug={city?.slug ?? ""} cityName={city?.name ?? ""}>
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
          <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <CityGuideCityPicker
              showCityPicker={showCityPicker}
              setShowCityPicker={setShowCityPicker}
              selectedCity={city?.name ?? ""}
              onSelectCity={onSelectCity}
            />

            <Join separator={<Spacer y={4} />}>
              <>
                <CityGuideItinerariesRail citySlug={city?.slug ?? ""} />

                <CityGuideEventGuides citySlug={city?.slug ?? ""} />
              </>

              <CityGuideEvents citySlug={city?.slug ?? ""} cityName={city?.name ?? ""} />
            </Join>
          </Screen.ScrollView>

          <CityGuideFloatingMapButton cityName={city?.name ?? ""} citySlug={city?.slug ?? ""} />
        </Screen.Body>
      </Screen>
    </AddToItineraryProvider>
  )
}
