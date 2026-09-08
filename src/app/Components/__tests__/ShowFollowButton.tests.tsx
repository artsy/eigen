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

  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableFollowShowsAndFairs: true })
  })

  it("renders nothing when the feature flag is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableFollowShowsAndFairs: false })

    renderWithRelay({ Show: () => ({ isFollowed: false }) })

    expect(screen.toJSON()).toBeNull()
  })

  it("offers to follow a show that is not followed", () => {
    renderWithRelay({ Show: () => ({ isFollowed: false }) })

    expect(screen.getByText("Save")).toBeTruthy()
  })

  it("reflects a followed show", () => {
    renderWithRelay({ Show: () => ({ isFollowed: true }) })

    expect(screen.getByText("Saved")).toBeTruthy()
  })

  it("commits a mutation when pressed", () => {
    const { env } = renderWithRelay({ Show: () => ({ isFollowed: false }) })

    fireEvent.press(screen.getByText("Save"))

    // Asserts that pressing follows, without asserting how the label behaves mid-flight.
    expect(env.mock.getAllOperations().length).toBeGreaterThan(0)
  })

  it("logs GraphQL errors without crashing", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined)
    const { env } = renderWithRelay({ Show: () => ({ isFollowed: false }) })

    fireEvent.press(screen.getByText("Save"))
    act(() => {
      env.mock.resolveMostRecentOperation({ data: undefined, errors: [{ message: "nope" }] })
    })

    await waitFor(() => expect(errorSpy).toHaveBeenCalled())
    errorSpy.mockRestore()
  })
})
