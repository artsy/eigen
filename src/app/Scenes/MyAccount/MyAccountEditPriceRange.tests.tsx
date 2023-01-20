import { MyAccountEditPriceRangeTestsQuery } from "__generated__/MyAccountEditPriceRangeTestsQuery.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import {
  MyAccountEditPriceRangeContainer,
  MyAccountEditPriceRangeQueryRenderer,
} from "./MyAccountEditPriceRange"

jest.unmock("react-relay")

describe(MyAccountEditPriceRangeQueryRenderer, () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => {
    jest.clearAllMocks()
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<MyAccountEditPriceRangeTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyAccountEditPriceRangeTestsQuery @relay_test_operation {
          me {
            ...MyAccountEditPriceRange_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <MyAccountEditPriceRangeContainer me={props.me} />
        }
        return null
      }}
    />
  )

  it("submits the changes", async () => {
    const { getAllByText, getByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        priceRange: "-1:2500",
        priceRangeMax: 2500,
        priceRangeMin: -1,
      }),
    })

    await flushPromiseQueue()

    expect(getAllByText("Price Range")[0]).toBeTruthy()

    expect(getByText("Under $2,500")).toBeTruthy()
  })
})
