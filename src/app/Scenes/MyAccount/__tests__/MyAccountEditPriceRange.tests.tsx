import { screen } from "@testing-library/react-native"
import { MyAccountEditPriceRangeTestsQuery } from "__generated__/MyAccountEditPriceRangeTestsQuery.graphql"
import { MyAccountEditPriceRange } from "app/Scenes/MyAccount/MyAccountEditPriceRange"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyAccountEditPriceRangeQueryRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<MyAccountEditPriceRangeTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <MyAccountEditPriceRange me={props.me} />
      }
      return null
    },
    query: graphql`
      query MyAccountEditPriceRangeTestsQuery @relay_test_operation {
        me {
          ...MyAccountEditPriceRange_me
        }
      }
    `,
  })

  it("submits the changes", async () => {
    renderWithRelay({
      Me: () => ({
        priceRange: "-1:2500",
        priceRangeMax: 2500,
        priceRangeMin: -1,
      }),
    })

    await flushPromiseQueue()

    expect(screen.getAllByText("Price Range")[0]).toBeTruthy()

    expect(screen.getByText("Under $2,500")).toBeTruthy()
  })
})
