import { fireEvent, screen } from "@testing-library/react-native"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ShowItemRow", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ show }: any) => <ShowItemRow show={show} />,
    query: graphql`
      query ShowItemRowTestQuery @relay_test_operation {
        show(id: "some-show") {
          ...ShowItemRow_show
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("offers to save a show that is not followed", () => {
    renderWithRelay({ Show: () => ({ is_followed: false }) })

    expect(screen.getByText("Save")).toBeTruthy()
  })

  it("reflects a followed show", () => {
    renderWithRelay({ Show: () => ({ is_followed: true }) })

    expect(screen.getByText("Saved")).toBeTruthy()
  })

  it("commits a mutation when pressed", () => {
    const { env } = renderWithRelay({ Show: () => ({ is_followed: false }) })

    fireEvent.press(screen.getByText("Save"))

    // Asserts that pressing follows, without asserting how the label behaves mid-flight.
    expect(env.mock.getAllOperations().length).toBeGreaterThan(0)
  })
})
