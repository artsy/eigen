import { defaultEnvironment } from "app/relay/createEnvironment"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { act } from "react-test-renderer"
import { GraphQLResponse } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
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

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as any as ReturnType<typeof createMockEnvironment>

describe(HomeQueryRenderer, () => {
  const getWrapper = async () => {
    const tree = renderWithHookWrappersTL(<HomeQueryRenderer />, mockEnvironment)

    mockMostRecentOperation("HomeAboveTheFoldQuery", {
      errors: [],
      data: {
        homePage: {
          artworkModules: [],
          salesModule: [],
          onboardingModule: {
            showMyCollectionCard: true,
            showSWACard: false,
          },
        },
        me: {
          canRequestEmailConfirmation: true,
        },
      },
    })
    mockMostRecentOperation("HomeBelowTheFoldQuery", {
      errors: [],
      data: {
        homePage: {
          artistModules: [],
          fairsModule: [],
        },
      },
    })

    await flushPromiseQueue()

    return tree
  }

  it("renders HomeFeedOnboardingRail with 1 card when only one card is visible", async () => {
    // __globalStoreTestUtils__?.injectFeatureFlags({ NAME: true })

    const { getByTestId, getAllByTestId } = await getWrapper()

    expect(getByTestId("my-collection-hf-onboadring-rail")).toBeTruthy()
    expect(getAllByTestId("my-collection-hf-onboadring-card")).toHaveLength(1)
  })

  it("renders home screen module flat list", async () => {
    const { getByTestId } = await getWrapper()

    expect(getByTestId("home-flat-list")).toBeTruthy()
  })

  it("renders an email confirmation banner", async () => {
    const { getByText } = await getWrapper()

    expect(getByText("Tap here to verify your email address")).toBeTruthy()
  })
})

const mockMostRecentOperation = (name: string, result: GraphQLResponse = { errors: [] }) => {
  expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)

  act(() => {
    mockEnvironment.mock.resolveMostRecentOperation(result)
  })
}
