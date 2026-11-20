import { ContextModule, OwnerType } from "@artsy/cohesion"
import { screen } from "@testing-library/react-native"
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
    renderWithRelay({
      Sale: () => ({
        startAt: null,
        endAt: null,
        requireIdentityVerification: false,
        registrationStatus: null,
      }),
    })

    expect(screen.getByText("Register to bid")).toBeOnTheScreen()
  })

  it("shows green checkmark when registered", () => {
    renderWithRelay({
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

    expect(screen.getByText("You're approved to bid")).toBeOnTheScreen()
  })

  it("hides the approve to bid hint if the user has active lots standing", () => {
    renderWithRelay({
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

    expect(screen.queryByText("You're approved to bid")).not.toBeOnTheScreen()
  })
})
