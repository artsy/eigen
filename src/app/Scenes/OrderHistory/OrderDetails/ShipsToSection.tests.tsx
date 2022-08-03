import { ShipsToSectionTestsQuery } from "__generated__/ShipsToSectionTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { ShipsToSectionFragmentContainer } from "./Components/ShipsToSection"

const order = {
  requestedFulfillment: {
    __typename: "CommerceShip",
    name: "my name",
    addressLine1: "myadress",
    city: "mycity",
    country: "BY",
    postalCode: "11238",
    phoneNumber: "7777",
    region: "myregion",
  },
}

describe("ShipsToSection", () => {
  const TestRenderer = () => (
    <QueryRenderer<ShipsToSectionTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ShipsToSectionTestsQuery @relay_test_operation {
          commerceOrder(id: "some-id") {
            internalID
            ...ShipsToSection_address
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <ShipsToSectionFragmentContainer address={props.commerceOrder} />
        }
        return null
      }}
    />
  )

  it("renders section when CommerceShip", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({ CommerceOrder: () => order })

    expect(extractText(tree.findByProps({ testID: "addressLine1" }))).toBe("myadress")
    expect(extractText(tree.findByProps({ testID: "city" }))).toBe("mycity, ")
    expect(extractText(tree.findByProps({ testID: "region" }))).toBe("myregion ")
    expect(extractText(tree.findByProps({ testID: "phoneNumber" }))).toBe("7777")
    expect(extractText(tree.findByProps({ testID: "country" }))).toBe("Belarus")
    expect(extractText(tree.findByProps({ testID: "postalCode" }))).toBe("11238")
  })

  it("renders section when CommerceShipArta", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    order.requestedFulfillment.__typename = "CommerceShipArta"
    resolveMostRecentRelayOperation({ CommerceOrder: () => order })

    expect(extractText(tree.findByProps({ testID: "addressLine1" }))).toBe("myadress")
    expect(extractText(tree.findByProps({ testID: "city" }))).toBe("mycity, ")
    expect(extractText(tree.findByProps({ testID: "region" }))).toBe("myregion ")
    expect(extractText(tree.findByProps({ testID: "phoneNumber" }))).toBe("7777")
    expect(extractText(tree.findByProps({ testID: "country" }))).toBe("Belarus")
    expect(extractText(tree.findByProps({ testID: "postalCode" }))).toBe("11238")
  })

  it("not renders section when CommercePickup", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    order.requestedFulfillment.__typename = "CommercePickup"
    resolveMostRecentRelayOperation({ CommerceOrder: () => order })

    expect(tree.instance).toBeNull()
  })
})
