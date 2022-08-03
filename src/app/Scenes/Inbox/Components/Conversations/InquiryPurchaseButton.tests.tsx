import { fireEvent } from "@testing-library/react-native"
import { InquiryPurchaseButtonTestsQuery } from "__generated__/InquiryPurchaseButtonTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Alert } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { InquiryPurchaseButtonFragmentContainer } from "./InquiryPurchaseButton"

jest.spyOn(Alert, "alert")

const TestRenderer = () => {
  return (
    <QueryRenderer<InquiryPurchaseButtonTestsQuery>
      environment={getRelayEnvironment()}
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
  const tree = renderWithWrappers(<TestRenderer />)
  resolveMostRecentRelayOperation(mockResolvers)
  return tree
}

describe("InquiryPurchaseButton", () => {
  it("navigates to the order webview when button is tapped", () => {
    const { getByText } = getWrapper({
      Artwork: () => ({
        internalID: "test-id",
      }),
    })

    fireEvent.press(getByText("Purchase"))
    resolveMostRecentRelayOperation({
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
    resolveMostRecentRelayOperation({
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
    expect(Alert.alert).toHaveBeenCalled()
  })
})
