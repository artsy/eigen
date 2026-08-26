import { Join, Screen, Spacer } from "@artsy/palette-mobile"
import { CityData, CityGuideCityPicker } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { CityGuideFloatingMapButton } from "app/Scenes/CityGuide/Components/CityGuideFloatingMapButton"
import { CityGuideMetaData } from "app/Scenes/CityGuide/Components/CityGuideMetaData"
import { goBack } from "app/system/navigation/navigate"
import { useState } from "react"
import expandedCities from "../../../../data/cityDataSortedByDisplayPreference-expanded.json"

const londonCity = expandedCities.find((city) => city.slug === "london-united-kingdom") as CityData

export const CityGuideNew: React.FC = () => {
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [city, setCity] = useState<CityData>(londonCity)

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    setCity(newCity)
  }

  return (
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
            <CityGuideMetaData />

            <CityGuideCuratedLists citySlug={city?.slug ?? ""} />

            <CityGuideEvents />
          </Join>
        </Screen.ScrollView>

        <CityGuideFloatingMapButton cityName={city?.name ?? ""} citySlug={city?.slug ?? ""} />
      </Screen.Body>
    </Screen>
  )
}
