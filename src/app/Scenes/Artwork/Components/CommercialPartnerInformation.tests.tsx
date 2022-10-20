import { CommercialPartnerInformationTestsQuery } from "__generated__/CommercialPartnerInformationTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CommercialPartnerInformationFragmentContainer } from "./CommercialPartnerInformation"

jest.unmock("react-relay")

describe("CommercialPartnerInformation", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = () => {
    return (
      <QueryRenderer<CommercialPartnerInformationTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query CommercialPartnerInformationTestsQuery @relay_test_operation @raw_response_type {
            artwork(id: "artworkId") {
              ...CommercialPartnerInformation_artwork
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.artwork) {
            return <CommercialPartnerInformationFragmentContainer artwork={props.artwork} />
          }

          return null
        }}
      />
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders all seller information when work is for sale and is not in a closed auction", () => {
    const { getByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => CommercialPartnerInformationArtwork,
    })

    expect(getByText("Ships from Brooklyn")).toBeTruthy()
    expect(getByText("Ships within the continental USA")).toBeTruthy()
    expect(getByText("VAT included in price")).toBeTruthy()
  })

  it("it renders 'Taxes may apply at checkout' instead of 'VAT included in price' when Avalara phase 2 flag is enabled", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableAvalaraPhase2: true })
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => CommercialPartnerInformationArtwork,
    })

    expect(queryByText("Taxes may apply at checkout.")).toBeTruthy()
    expect(queryByText("VAT included in price")).toBeFalsy()
  })

  it("Hides shipping/tax information if the work is not enabled for buy now or make offer", () => {
    const CommercialPartnerInformationNoEcommerce = {
      ...CommercialPartnerInformationArtwork,
      isAcquireable: false,
      isOfferable: false,
    }
    const { queryByText } = renderWithWrappers(<TestWrapper />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => CommercialPartnerInformationNoEcommerce,
    })

    expect(queryByText("Ships from Brooklyn")).toBeFalsy()
    expect(queryByText("Ships within the continental USA")).toBeFalsy()
    expect(queryByText("VAT included in price")).toBeFalsy()
  })
})

const CommercialPartnerInformationArtwork = {
  isAcquireable: true,
  isOfferable: false,
  shippingOrigin: "Brooklyn",
  shippingInfo: "Ships within the continental USA",
  partner: {
    name: "Bob's Gallery",
  },
  priceIncludesTaxDisplay: "VAT included in price",
}
