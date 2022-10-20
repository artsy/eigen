import { ShippingAndTaxesTestQuery } from "__generated__/ShippingAndTaxesTestQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ShippingAndTaxesFragmentContainer } from "./ShippingAndTaxes"

jest.unmock("react-relay")

describe("ShippingAndTaxes", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<ShippingAndTaxesTestQuery>
        environment={env}
        variables={{}}
        query={graphql`
          query ShippingAndTaxesTestQuery {
            artwork(id: "artworkID") {
              ...ShippingAndTaxes_artwork
            }
          }
        `}
        render={({ props }) => {
          if (props?.artwork) {
            return <ShippingAndTaxesFragmentContainer artwork={props.artwork} />
          }

          return null
        }}
      />
    )
  }

  it("should render all information", () => {
    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Artwork: () => artwork,
    })

    expect(queryByText("Taxes may apply at checkout", { exact: false })).toBeDefined()
    expect(queryByText("City, State, Country")).toBeDefined()
    expect(queryByText("Shipping: Calculated in checkout")).toBeDefined()
  })

  it("should NOT render all shipping information", () => {
    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Artwork: () => ({
        shippingOrigin: null,
        shippingInfo: null,
      }),
    })

    expect(queryByText("Taxes may apply at checkout", { exact: false })).toBeDefined()
    expect(queryByText("City, State, Country")).toBeNull()
    expect(queryByText("Shipping: Calculated in checkout")).toBeNull()
  })
})

const artwork = {
  shippingOrigin: "City, State, Country",
  shippingInfo: "Shipping: Calculated in checkout",
}
