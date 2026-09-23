import { screen } from "@testing-library/react-native"
import { ShowHeaderFragmentContainer } from "app/Scenes/Show/Components/ShowHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ShowHeader", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ show }: any) => <ShowHeaderFragmentContainer show={show} />,
    query: graphql`
      query ShowHeaderTestsQuery @relay_test_operation {
        show(id: "a-show") {
          ...ShowHeader_show
        }
      }
    `,
  })

  it("renders a 'Show' eyebrow above the title", () => {
    renderWithRelay({
      Show: () => ({ name: "Splash: Sea, Beach, and Pool" }),
    })

    expect(screen.getByText("Show")).toBeOnTheScreen()
    expect(screen.getByText("Splash: Sea, Beach, and Pool")).toBeOnTheScreen()
  })
})
