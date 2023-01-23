import { ShippingAndTaxesTestQuery } from "__generated__/ShippingAndTaxesTestQuery.graphql"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
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

    // Tax info
    expect(queryByText("Tax Info")).toBeDefined()
    expect(queryByText("Link Button")).toBeDefined()

    expect(queryByText("City, State, Country")).toBeDefined()
    expect(queryByText("Shipping: Calculated in checkout")).toBeDefined()
    expect(queryByText("VAT included in price")).toBeDefined()
  })

  it("should NOT render shipping information if it is not available", () => {
    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Artwork: () => ({
        shippingOrigin: null,
        shippingInfo: null,
        priceIncludesTaxDisplay: null,
        taxInfo: null,
      }),
    })

    // Tax info
    expect(queryByText("Tax Info")).toBeNull()
    expect(queryByText("Link Button")).toBeNull()

    expect(queryByText("City, State, Country")).toBeNull()
    expect(queryByText("Shipping: Calculated in checkout")).toBeNull()
    expect(queryByText("VAT included in price")).toBeNull()
  })
})

const artwork = {
  shippingOrigin: "City, State, Country",
  shippingInfo: "Shipping: Calculated in checkout",
  priceIncludesTaxDisplay: "VAT included in price",
  taxInfo: {
    displayText: "Tax Info",
    moreInfo: {
      displayText: "Link Button",
    },
  },
}
