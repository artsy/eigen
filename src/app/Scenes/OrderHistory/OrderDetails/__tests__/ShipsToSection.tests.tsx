import { ShipsToSectionTestsQuery } from "__generated__/ShipsToSectionTestsQuery.graphql"
import { ShipsToSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/ShipsToSection"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

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
  const { renderWithRelay } = setupTestWrapper<ShipsToSectionTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <ShipsToSectionFragmentContainer address={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query ShipsToSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          internalID
          ...ShipsToSection_address
        }
      }
    `,
  })

  it("renders section when CommerceShip", () => {
    const tree = renderWithRelay({ CommerceOrder: () => order })

    expect(extractText(tree.UNSAFE_getByProps({ testID: "addressLine1" }))).toBe("myadress")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "city" }))).toBe("mycity, ")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "region" }))).toBe("myregion ")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "phoneNumber" }))).toBe("7777")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "country" }))).toBe("Belarus")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "postalCode" }))).toBe("11238")
  })

  it("renders section when CommerceShipArta", () => {
    const tree = renderWithRelay({ CommerceOrder: () => order })

    expect(extractText(tree.UNSAFE_getByProps({ testID: "addressLine1" }))).toBe("myadress")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "city" }))).toBe("mycity, ")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "region" }))).toBe("myregion ")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "phoneNumber" }))).toBe("7777")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "country" }))).toBe("Belarus")
    expect(extractText(tree.UNSAFE_getByProps({ testID: "postalCode" }))).toBe("11238")
  })
})
