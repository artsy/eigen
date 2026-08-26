import { Join, Screen, Spacer } from "@artsy/palette-mobile"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { CityGuideFloatingMapButton } from "app/Scenes/CityGuide/Components/CityGuideFloatingMapButton"
import { CityGuideMetaData } from "app/Scenes/CityGuide/Components/CityGuideMetaData"
import { goBack } from "app/system/navigation/navigate"

export const CityGuideNew: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader
        title="London"
        rightElements={
          <CityGuideCitySwitcherButton cityName="Berlin" onPress={() => {}} />
        }
        onBack={goBack}
        hideTitle
      />

      <Screen.Body fullwidth>
        <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Join separator={<Spacer y={4} />}>
            <CityGuideMetaData />

            <CityGuideCuratedLists />

            <CityGuideEvents />
          </Join>
        </Screen.ScrollView>

        <CityGuideFloatingMapButton />
      </Screen.Body>
    </Screen>
  )
}
