import { screen } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ComponentName } from "../ComponentName"

describe("ComponentName", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ComponentName,
    query: graphql`
      query ComponentNameTestQuery @relay_test_operation {
        viewer {
          ...ComponentName_viewer
        }
      }
    `,
  })

  it("renders data from GraphQL", async () => {
    await renderWithRelay({
      Viewer: () => ({
        name: "Test Name",
      }),
    })

    expect(screen.getByText("Test Name")).toBeOnTheScreen()
  })

  it("handles error states", async () => {
    const { mockRejectLastOperation } = await renderWithRelay()

    await mockRejectLastOperation(new Error("Network error"))

    expect(screen.getByText("Error message")).toBeOnTheScreen()
  })
})
