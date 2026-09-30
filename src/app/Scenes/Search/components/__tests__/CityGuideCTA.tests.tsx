import { CityGuideCTA } from "app/Scenes/Search/components/CityGuideCTA"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Image, TouchableOpacity } from "react-native"

describe("Search page empty state", () => {
  it(`renders correctly`, async () => {
    const tree = renderWithWrappersLEGACY(<CityGuideCTA />)
    expect(extractText(tree.root)).toContain("Explore Art on View")
    expect(tree.root.findAllByType(Image)).toHaveLength(1)
  })

  it("navigates to the City Guide when the itineraries flag is on", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideItineraries: true })

    const tree = renderWithWrappersLEGACY(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/city-guide")
  })

  it("navigates to Local Discovery when the itineraries flag is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideItineraries: false })

    const tree = renderWithWrappersLEGACY(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/local-discovery")
  })
})
