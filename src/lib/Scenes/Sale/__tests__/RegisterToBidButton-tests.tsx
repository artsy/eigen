import { ContextModule, OwnerType } from "@artsy/cohesion"
import { RegisterToBidButtonTestsQuery } from "__generated__/RegisterToBidButtonTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { extractText } from "../../../tests/extractText"
import { RegisterToBidButtonContainer } from "../Components/RegisterToBidButton"

jest.unmock("react-relay")

describe("RegisterToBidButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<RegisterToBidButtonTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query RegisterToBidButtonTestsQuery($saleID: String!) @relay_test_operation {
          sale(id: "the-sale") {
            ...RegisterToBidButton_sale
          }
          me {
            ...RegisterToBidButton_me @arguments(saleID: $saleID)
          }
        }
      `}
      variables={{ saleID: "sale-id" }}
      render={({ props }) => {
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
      }}
    />
  )

  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("shows button when not registered", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Sale: () => ({
        startAt: null,
        endAt: null,
        requireIdentityVerification: false,
        registrationStatus: null,
      }),
    })

    expect(tree.root.findAllByType(Button)[0].props.children).toMatch("Register to bid")
  })

  it("shows green checkmark when registered", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "the-sale",
          name: "the sale",
          internalID: "the-sale-internal",
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
    )

    expect(tree.root.findAllByType(Text)[0].props.children).toMatch("You're approved to bid")
  })

  it("hides the approve to bid hint if the user has active lots standing", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Sale: () => ({
          slug: "the-sale",
          name: "the sale",
          internalID: "the-sale-internal",
          startAt: null,
          endAt: null,
          requireIdentityVerification: false,
          registrationStatus: {
            qualifiedForBidding: true,
          },
        }),
        Me: () => ({
          biddedLots: [{ lot1: "lot1" }, { lot2: "lot2" }],
        }),
      })
    )

    expect(extractText(tree.root)).not.toContain("You're approved to bid")
  })
})
