import { Join, Screen, Spacer } from "@artsy/palette-mobile"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { CityGuideMetaData } from "app/Scenes/CityGuide/Components/CityGuideMetaData"

export const CityGuide: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader
        title="London"
        rightElements={
          <CityGuideCitySwitcherButton cityName="Berlin" isLoading={false} onPress={() => {}} />
        }
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
      </Screen.Body>
    </Screen>
  )
}
