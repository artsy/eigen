import { fireEvent } from "@testing-library/react-native"
import { InquiryPurchaseButtonTestsQuery } from "__generated__/InquiryPurchaseButtonTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Alert } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { InquiryPurchaseButtonFragmentContainer } from "./InquiryPurchaseButton"

jest.unmock("react-relay")
jest.spyOn(Alert, "alert")

let environment: ReturnType<typeof createMockEnvironment>

const TestRenderer = () => {
  return (
    <QueryRenderer<InquiryPurchaseButtonTestsQuery>
      environment={environment}
      query={graphql`
        query InquiryPurchaseButtonTestsQuery($id: String!) @relay_test_operation {
          artwork(id: $id) {
            ...InquiryPurchaseButton_artwork
          }
        }
      `}
      variables={{ id: "test-id" }}
      render={({ props, error }) => {
        if (props?.artwork) {
          return (
            <InquiryPurchaseButtonFragmentContainer
              artwork={props!.artwork!}
              editionSetID={null}
              conversationID="1234"
            >
              Purchase
            </InquiryPurchaseButtonFragmentContainer>
          )
        } else if (error) {
          console.error(error)
        }
      }}
    />
  )
}

const getWrapper = (mockResolvers = {}) => {
  const tree = renderWithWrappersTL(<TestRenderer />)
  act(() => {
    environment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
  })
  return tree
}

describe("InquiryPurchaseButton", () => {
  beforeEach(() => {
    require("app/relay/createEnvironment").reset()
    environment = require("app/relay/createEnvironment").defaultEnvironment
  })

  it("navigates to the order webview when button is tapped", () => {
    const { getByText } = getWrapper({
      Artwork: () => ({
        internalID: "test-id",
      }),
    })

    fireEvent.press(getByText("Purchase"))
    environment.mock.resolveMostRecentOperation((operation) => {
      return MockPayloadGenerator.generate(operation, {
        Mutation: () => {
          return {
            createInquiryOrder: {
              orderOrError: {
                __typename: "CommerceOrderWithMutationSuccess",
                order: { internalID: "4567" },
              },
            },
          }
        },
      })
    })

    expect(navigate).toHaveBeenCalledWith("/orders/4567", {
      modal: true,
      replace: true,
      passProps: { orderID: "4567", title: "Purchase" },
    })
  })

  it("presents an error dialogue if mutation returns an error response", () => {
    const { getByText } = getWrapper({
      Artwork: () => ({
        internalID: "test-id",
      }),
    })

    fireEvent.press(getByText("Purchase"))
    environment.mock.resolveMostRecentOperation((operation) => {
      return MockPayloadGenerator.generate(operation, {
        Mutation: () => {
          return {
            createInquiryOrder: {
              orderOrError: {
                __typename: "CommerceOrderWithMutationFailure",
                error: "Error",
              },
            },
          }
        },
      })
    })
    expect(Alert.alert).toHaveBeenCalled()
  })
})
