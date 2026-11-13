import { HomeViewSectionCityGuidesQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionCityGuides"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Kept apart from HomeViewSectionCityGuides.tests.tsx, which mocks `withSuspense` away
describe("HomeViewSectionCityGuidesQueryRenderer", () => {
  const renderQueryRenderer = () =>
    renderWithWrappers(
      <HomeViewSectionCityGuidesQueryRenderer sectionID="home-view-section-city-guides" index={0} />
    )

  const operationNames = () =>
    getMockRelayEnvironment()
      .mock.getAllOperations()
      .map((operation) => operation.request.node.operation.name)

  it("doesn't fetch the section when AREnableHomeViewCityGuidesRail is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHomeViewCityGuidesRail: false })

    renderQueryRenderer()

    expect(operationNames()).not.toContain("HomeViewSectionCityGuidesQuery")
  })

  it("fetches the section when AREnableHomeViewCityGuidesRail is on", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHomeViewCityGuidesRail: true })

    renderQueryRenderer()

    expect(operationNames()).toContain("HomeViewSectionCityGuidesQuery")
  })
})
