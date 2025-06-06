import { fireEvent, screen } from "@testing-library/react-native"
import { ShippingAndTaxesTestQuery } from "__generated__/ShippingAndTaxesTestQuery.graphql"
import { ShippingAndTaxesFragmentContainer } from "app/Scenes/Artwork/Components/ShippingAndTaxes"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

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
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Artwork: () => artwork,
    })

    // Tax info
    expect(screen.getByText(/Tax Info/)).toBeDefined()
    expect(screen.getByText(/Link Button/)).toBeDefined()

    expect(screen.getByText(/City, State, Country/)).toBeDefined()
    expect(screen.getByText(/Shipping: Calculated in checkout/)).toBeDefined()
    expect(screen.getByText(/Pickup available/)).toBeDefined()
    expect(screen.getByText(/VAT included in price/)).toBeDefined()
  })

  describe("Analytics", () => {
    it("tracks event", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(env, {
        Artwork: () => artwork,
      })
      const link = screen.getByText(/Link Button/)

      fireEvent.press(link)
      await flushPromiseQueue()

      expect(mockTrackEvent).toHaveBeenCalled()
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedLearnMore",
        context_module: "artworkDetails",
        context_screen_owner_type: "artwork",
        subject: "Learn more",
        flow: "Shipping",
      })
    })
  })

  it("should NOT render shipping information if it is not available", () => {
    renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(env, {
      Artwork: () => ({
        shippingOrigin: null,
        shippingInfo: null,
        priceIncludesTaxDisplay: null,
        taxInfo: null,
      }),
    })

    // Tax info
    expect(screen.queryByText("Tax Info")).toBeNull()
    expect(screen.queryByText("Link Button")).toBeNull()

    expect(screen.queryByText("City, State, Country")).toBeNull()
    expect(screen.queryByText("Shipping: Calculated in checkout")).toBeNull()
    expect(screen.queryByText("VAT included in price")).toBeNull()
  })
})

const artwork = {
  shippingOrigin: "City, State, Country",
  shippingInfo: "Shipping: Calculated in checkout",
  priceIncludesTaxDisplay: "VAT included in price",
  pickupAvailable: true,
  taxInfo: {
    displayText: "Tax Info",
    moreInfo: {
      displayText: "Link Button",
    },
  },
}
