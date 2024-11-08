import { screen } from "@testing-library/react-native"
import { MyAccountEditPriceRangeTestsQuery } from "__generated__/MyAccountEditPriceRangeTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import {
  MyAccountEditPriceRangeContainer,
  MyAccountEditPriceRangeQueryRenderer,
} from "./MyAccountEditPriceRange"

describe(MyAccountEditPriceRangeQueryRenderer, () => {
  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableNewNavigation: true,
    })
  })

  const { renderWithRelay } = setupTestWrapper<MyAccountEditPriceRangeTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <MyAccountEditPriceRangeContainer me={props.me} />
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
