import { NavigationContainer } from "@react-navigation/native"
import { BidFlowTestsQuery } from "__generated__/BidFlowTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { BidFlowFragmentContainer } from "../../../Containers/BidFlow"
import { BidResultScreen } from "../Screens/BidResult"
import { BillingAddressScreen } from "../Screens/BillingAddress2"
import { ConfirmBidScreen } from "../Screens/ConfirmBid"
import { SelectCountry } from "../Screens/SelectCountry2"
import { MaxBidScreen } from "../Screens/SelectMaxBid"

jest.unmock("react-relay")

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

jest.mock("../Context/TimeOffsetProvider.tsx", () => ({
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  TimeOffsetProvider: ({ children }) => children,
}))

describe("RegisterToBidButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<BidFlowTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query BidFlowTestsQuery($artworkID: String!, $saleID: String!) @relay_test_operation {
          artwork(id: $artworkID) {
            sale_artwork: saleArtwork(saleID: $saleID) {
              ...BidFlow_sale_artwork
            }
          }
          me {
            ...BidFlow_me
          }
        }
      `}
      variables={{
        artworkID: "artwork-id",
        saleID: "sale-id",
      }}
      render={({ props }) => {
        if (props?.artwork?.sale_artwork && props?.me) {
          return <BidFlowFragmentContainer sale_artwork={props.artwork.sale_artwork} me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("creates a navigation stack containing expected components", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    expect(wrapper.root.findAllByType(NavigationContainer)).toBeDefined()
    expect(wrapper.root.findAllByType(MaxBidScreen)).toBeDefined()
    expect(wrapper.root.findAllByType(ConfirmBidScreen)).toBeDefined()
    expect(wrapper.root.findAllByType(BidResultScreen)).toBeDefined()
    expect(wrapper.root.findAllByType(BillingAddressScreen)).toBeDefined()
    expect(wrapper.root.findAllByType(SelectCountry)).toBeDefined()
  })
})
