import { screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { HomeContainer } from "./HomeContainer"

describe("conditional rendering of old vs new home screen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when ARPreferLegacyHomeScreen is true", () => {
    beforeEach(
      () => __globalStoreTestUtils__?.injectFeatureFlags({ ARPreferLegacyHomeScreen: true })
    )

    it("renders the old screen always", () => {
      renderWithWrappers(<HomeContainer />)
      expect(screen.queryByTestId("new-home-view-skeleton")).not.toBeOnTheScreen()
    })
  })

  describe("when ARPreferLegacyHomeScreen is false", () => {
    beforeEach(
      () => __globalStoreTestUtils__?.injectFeatureFlags({ ARPreferLegacyHomeScreen: false })
    )

    describe("when AREnableDynamicHomeView is true", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ AREnableDynamicHomeView: true })
      )

      it("renders the new screen", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.getByTestId("new-home-view-skeleton")).toBeOnTheScreen()
      })
    })

    describe("when AREnableDynamicHomeView is false", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ AREnableDynamicHomeView: false })
      )

      it("renders the old screen", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.queryByTestId("new-home-view-skeleton")).not.toBeOnTheScreen()
      })
    })
  })
})
