import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ShowFollowButton } from "app/Components/ShowFollowButton"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ShowFollowButton", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ show }: any) => <ShowFollowButton show={show} />,
    query: graphql`
      query ShowFollowButtonTestQuery @relay_test_operation {
        show(id: "some-show") {
          ...ShowFollowButton_show
        }
      }
    `,
  })

  const { renderWithRelay: renderIconVariant } = setupTestWrapper({
    Component: ({ show }: any) => <ShowFollowButton show={show} variant="icon" />,
    query: graphql`
      query ShowFollowButtonIconTestQuery @relay_test_operation {
        show(id: "some-show") {
          ...ShowFollowButton_show
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableFollowShowsAndFairs: true })
  })

  it("renders nothing when the feature flag is off", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableFollowShowsAndFairs: false })

    await renderWithRelay({ Show: () => ({ isFollowed: false }) })

    expect(screen.toJSON()).toBeNull()
  })

  it("offers to follow a show that is not followed", async () => {
    await renderWithRelay({ Show: () => ({ isFollowed: false }) })

    expect(screen.getByText("Save")).toBeTruthy()
  })

  it("reflects a followed show", async () => {
    await renderWithRelay({ Show: () => ({ isFollowed: true }) })

    expect(screen.getByText("Saved")).toBeTruthy()
  })

  it("commits a mutation when pressed", async () => {
    const { env } = await renderWithRelay({ Show: () => ({ isFollowed: false }) })

    await fireEvent.press(screen.getByText("Save"))

    // Asserts that pressing follows, without asserting how the label behaves mid-flight.
    expect(env.mock.getAllOperations().length).toBeGreaterThan(0)
  })

  it("logs GraphQL errors without crashing", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined)
    const { env } = await renderWithRelay({ Show: () => ({ isFollowed: false }) })

    await fireEvent.press(screen.getByText("Save"))
    await act(() => {
      env.mock.resolveMostRecentOperation({ data: undefined, errors: [{ message: "nope" }] })
    })

    await waitFor(() => expect(errorSpy).toHaveBeenCalled())
    errorSpy.mockRestore()
  })

  describe("the icon variant", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideItineraries: true })
    })

    it("renders when the show has a location and the itinerary flag is on", async () => {
      await renderIconVariant({
        Show: () => ({ isOnlineExclusive: false, location: { address: "123 Main St" } }),
      })

      expect(screen.getByTestId("show-follow-icon")).toBeOnTheScreen()
    })

    it("renders nothing when the itinerary flag is off", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCityGuideItineraries: false })

      await renderIconVariant({
        Show: () => ({ isOnlineExclusive: false, location: { address: "123 Main St" } }),
      })

      expect(screen.toJSON()).toBeNull()
    })

    it("renders nothing for an online-exclusive show", async () => {
      await renderIconVariant({
        Show: () => ({ isOnlineExclusive: true, location: { address: "123 Main St" } }),
      })

      expect(screen.toJSON()).toBeNull()
    })

    it("renders nothing for a show with no address", async () => {
      await renderIconVariant({ Show: () => ({ isOnlineExclusive: false, location: null }) })

      expect(screen.toJSON()).toBeNull()
    })
  })
})
