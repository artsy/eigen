import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Text, Button } from "@artsy/palette-mobile"
import { RegisterToBidButtonTestsQuery } from "__generated__/RegisterToBidButtonTestsQuery.graphql"
import { RegisterToBidButtonContainer } from "app/Scenes/Sale/Components/RegisterToBidButton"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("RegisterToBidButton", () => {
  const { renderWithRelay } = setupTestWrapper<RegisterToBidButtonTestsQuery>({
    Component: (props) => {
      if (props?.sale && props?.me) {
        return (
          <RegisterToBidButtonContainer
            sale={props.sale}
            me={props.me}
            contextType={OwnerType.sale}
            contextModule={ContextModule.auctionHome}
          />
        )
      }
      return null
    },
    query: graphql`
      query RegisterToBidButtonTestsQuery($saleID: String!) @relay_test_operation {
        sale(id: "the-sale") {
          ...RegisterToBidButton_sale
        }
        me {
          ...RegisterToBidButton_me @arguments(saleID: $saleID)
        }
      }
    `,
  })

  it("shows button when not registered", () => {
    const tree = renderWithRelay({
      Sale: () => ({
        startAt: null,
        endAt: null,
        requireIdentityVerification: false,
        registrationStatus: null,
      }),
    })

    expect(tree.UNSAFE_getAllByType(Button)[0].props.children).toMatch("Register to bid")
  })

  it("shows green checkmark when registered", () => {
    const tree = renderWithRelay({
      Sale: () => ({
        startAt: null,
        endAt: null,
        requireIdentityVerification: false,
        registrationStatus: {
          qualifiedForBidding: true,
        },
      }),
      Me: () => ({
        biddedLots: [],
      }),
    })

    expect(tree.UNSAFE_getAllByType(Text)[0].props.children).toMatch("You're approved to bid")
  })

  it("hides the approve to bid hint if the user has active lots standing", () => {
    const tree = renderWithRelay({
      Sale: () => ({
        startAt: null,
        endAt: null,
        requireIdentityVerification: false,
        registrationStatus: {
          qualifiedForBidding: true,
        },
      }),
      Me: () => ({
        biddedLots: [
          {
            saleArtwork: {
              id: "some-id",
            },
          },
        ],
      }),
    })

    expect(tree.queryByText("You're approved to bid")).toBeNull()
  })
})
