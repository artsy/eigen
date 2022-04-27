import { InquiryMakeOfferButtonTestsQuery } from "__generated__/InquiryMakeOfferButtonTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { Alert } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { InquiryMakeOfferButtonFragmentContainer } from "./InquiryMakeOfferButton"

jest.unmock("react-relay")

jest.spyOn(Alert, "alert")

beforeEach(() => {
  jest.useFakeTimers()
  env = createMockEnvironment()
  ;(Alert.alert as jest.Mock).mockClear()
})

afterEach(() => {
  jest.clearAllMocks()
})

let env: ReturnType<typeof createMockEnvironment>

const TestRenderer = () => {
  return (
    <QueryRenderer<InquiryMakeOfferButtonTestsQuery>
      environment={env}
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
  const tree = renderWithWrappers(<TestRenderer />)
  act(() => {
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
  })
  return tree
}

describe("Inquiry make offer button", () => {
  it("navigates to the order webview when button is tapped", () => {
    const wrapper = getWrapper()
    wrapper.root.findByType(Button).props.onPress()
    env.mock.resolveMostRecentOperation((operation) => {
      const mockResolvers = {
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
      }
      return MockPayloadGenerator.generate(operation, mockResolvers)
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
    env.mock.resolveMostRecentOperation((operation) => {
      const mockResolvers = {
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
      }
      return MockPayloadGenerator.generate(operation, mockResolvers)
    })
    expect(Alert.alert).toHaveBeenCalled()
  })
})
