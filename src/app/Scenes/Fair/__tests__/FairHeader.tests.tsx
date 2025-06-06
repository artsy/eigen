import { screen } from "@testing-library/react-native"
import { FairHeader } from "app/Scenes/Fair/Components/FairHeader"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairHeader", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: FairHeader,
    query: graphql`
      query FairHeaderTestsQuery @relay_test_operation {
        fair(id: "fair-id") {
          ...FairHeader_fair
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(/mock-value-for-field-"name"/)).toBeOnTheScreen()
    expect(screen.getByText(/mock-value-for-field-"exhibitionPeriod"/)).toBeOnTheScreen()
  })

  it("renders the fair title", () => {
    renderWithRelay({ Fair: () => ({ name: "Art Basel Hong Kong 2020" }) })

    expect(screen.getByText("Art Basel Hong Kong 2020")).toBeOnTheScreen()
  })

  it("renders the fair icon", () => {
    renderWithRelay({
      Fair: () => ({
        profile: {
          icon: {
            imageUrl: "https://testing.artsy.net/art-basel-hong-kong-icon",
          },
        },
      }),
    })

    expect(screen.getByTestId("fair-profile-image")).toBeOnTheScreen()
  })

  it("displays the timing info", () => {
    renderWithRelay({
      Fair: () => ({
        endAt: "2020-09-19T08:00:00+00:00",
      }),
    })

    expect(screen.getByText("Closed")).toBeOnTheScreen()
  })
})
