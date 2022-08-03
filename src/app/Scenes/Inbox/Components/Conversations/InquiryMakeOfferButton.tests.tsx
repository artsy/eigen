import { InquiryMakeOfferButtonTestsQuery } from "__generated__/InquiryMakeOfferButtonTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Button } from "palette"
import { Alert } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { InquiryMakeOfferButtonFragmentContainer } from "./InquiryMakeOfferButton"

jest.spyOn(Alert, "alert")

beforeEach(() => {
  jest.useFakeTimers()
  ;(Alert.alert as jest.Mock).mockClear()
})

afterEach(() => {
  jest.clearAllMocks()
})

const TestRenderer = () => {
  return (
    <QueryRenderer<InquiryMakeOfferButtonTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query InquiryMakeOfferButtonTestsQuery($id: String!) @relay_test_operation {
          artwork(id: $id) {
            ...InquiryMakeOfferButton_artwork
          }
        }
      `}
      variables={{ id: "great-artttt" }}
      render={({ props, error }) => {
        if (Boolean(props?.artwork!)) {
          return (
            <InquiryMakeOfferButtonFragmentContainer
              artwork={props!.artwork!}
              editionSetID={null}
              conversationID="1234"
            >
              Make an Offer
            </InquiryMakeOfferButtonFragmentContainer>
          )
        } else if (Boolean(error)) {
          console.error(error)
        }
      }}
    />
  )
}

const getWrapper = (mockResolvers = {}) => {
  const tree = renderWithWrappersLEGACY(<TestRenderer />)
  resolveMostRecentRelayOperation(mockResolvers)
  return tree
}

describe("Inquiry make offer button", () => {
  it("navigates to the order webview when button is tapped", () => {
    const wrapper = getWrapper()
    wrapper.root.findByType(Button).props.onPress()
    resolveMostRecentRelayOperation({
      Mutation: () => {
        return {
          createInquiryOfferOrder: {
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
      passProps: { orderID: "4567", title: "Make Offer" },
    })
  })

  it("presents an error dialogue if mutation returns an error response", () => {
    const wrapper = getWrapper()
    wrapper.root.findByType(Button).props.onPress()
    resolveMostRecentRelayOperation({
      Mutation: () => {
        return {
          createInquiryOfferOrder: {
            orderOrError: {
              __typename: "CommerceOrderWithMutationFailure",
              error: "ERRORRRRRR",
            },
          },
        }
      },
    })
    expect(Alert.alert).toHaveBeenCalled()
  })
})
