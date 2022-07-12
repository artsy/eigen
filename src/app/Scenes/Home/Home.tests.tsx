import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { HomeQueryRenderer } from "./Home"

jest.mock("app/Components/Home/ArtistRails/ArtistRail", () => ({
  ArtistRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("app/Scenes/Home/Components/ArtworkModuleRail", () => ({
  ArtworkModuleRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("app/Scenes/Home/Components/FairsRail", () => ({
  FairsRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("app/Scenes/Home/Components/SalesRail", () => ({
  SalesRailFragmentContainer: jest.fn(() => null),
}))

describe("HomeQueryRenderer", () => {
  it("renders home screen module flat list", async () => {
    renderWithRelayWrappersTL(<HomeQueryRenderer />)

    resolveHomeQueries()

    expect(screen.getByTestId("home-flat-list")).toBeTruthy()
  })

  it("renders an email confirmation banner", async () => {
    renderWithRelayWrappersTL(<HomeQueryRenderer />)

    resolveHomeQueries()

    expect(screen.getByText("Tap here to verify your email address")).toBeTruthy()
  })
})

const resolveHomeQueries = () => {
  resolveMostRecentRelayOperation({
    HomeAboveTheFoldQuery: () => ({
      errors: [],
      data: {
        homePage: {
          artworkModules: [],
          salesModule: [],
        },
        me: {
          canRequestEmailConfirmation: true,
        },
      },
    }),
  })
  resolveMostRecentRelayOperation({
    HomeBelowTheFoldQuery: () => ({
      errors: [],
      data: {
        homePage: {
          artistModules: [],
          fairsModule: [],
        },
      },
    }),
  })
}
