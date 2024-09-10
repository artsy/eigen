import { screen } from "@testing-library/react-native"
import * as ArtsyNativeModule from "app/NativeModules/ArtsyNativeModule"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { HomeContainer } from "./HomeContainer"

jest.mock("app/NativeModules/ArtsyNativeModule", () => ({
  ...jest.requireActual("app/NativeModules/ArtsyNativeModule"),
  ArtsyNativeModule: {
    ArtsyNativeModule: {
      isBetaOrDev: undefined, // set in each test condition below
    },
  },
}))

describe("conditional rendering of old vs new home screen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when running in beta or simulator", () => {
    beforeEach(() => (ArtsyNativeModule.ArtsyNativeModule.isBetaOrDev = true))

    describe("when ARPreferLegacyHomeScreen is false", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ ARPreferLegacyHomeScreen: false })
      )

      xit("renders the NEW screen", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.getByTestId("new-home-view-skeleton")).toBeOnTheScreen()
      })

      it("temporarily renders the old screen while we make breaking changes", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.queryByTestId("new-home-view-skeleton")).not.toBeOnTheScreen()
      })
    })

    describe("when ARPreferLegacyHomeScreen is true", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ ARPreferLegacyHomeScreen: true })
      )

      it("renders the old screen", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.queryByTestId("new-home-view-skeleton")).not.toBeOnTheScreen()
      })
    })
  })

  describe("when NOT running in beta or simulator", () => {
    beforeEach(() => (ArtsyNativeModule.ArtsyNativeModule.isBetaOrDev = false))

    describe("when ARPreferLegacyHomeScreen is false", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ ARPreferLegacyHomeScreen: false })
      )

      it("renders the old screen", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.queryByTestId("new-home-view-skeleton")).not.toBeOnTheScreen()
      })
    })

    describe("when ARPreferLegacyHomeScreen is true", () => {
      beforeEach(
        () => __globalStoreTestUtils__?.injectFeatureFlags({ ARPreferLegacyHomeScreen: true })
      )

      it("renders the old screen", () => {
        renderWithWrappers(<HomeContainer />)
        expect(screen.queryByTestId("new-home-view-skeleton")).not.toBeOnTheScreen()
      })
    })
  })
})
