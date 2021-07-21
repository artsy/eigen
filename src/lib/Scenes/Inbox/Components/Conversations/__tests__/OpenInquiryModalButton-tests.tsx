import { OpenInquiryModalButtonTestsQuery } from "__generated__/OpenInquiryModalButtonTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OpenInquiryModalButtonContainer } from "../OpenInquiryModalButton"

jest.unmock("react-relay")

let mockEnv: ReturnType<typeof createMockEnvironment>

const TestRenderer = () => {
  return (
    <QueryRenderer<OpenInquiryModalButtonTestsQuery>
      environment={mockEnv}
      query={graphql`
        query OpenInquiryModalButtonTestsQuery($artworkID: String!) @relay_test_operation {
          artwork(id: $artworkID) {
            isOfferableFromInquiry
          }
        }
      `}
      variables={{ artworkID: "i-love-nyc" }}
      render={({ props, error }) => {
        if (error) {
          console.log(error)
        }

        if (props?.artwork?.isOfferableFromInquiry) {
          return <OpenInquiryModalButtonContainer artworkID="i-love-nyc" conversationID="test-id" />
        } else {
          return null
        }
      }}
    />
  )
}

const mockResolver = {
  Artwork: () => ({
    isOfferableFromInquiry: true,
  }),
}

const uneligibleArtworkMockResolver = {
  Artwork: () => ({
    isOfferableFromInquiry: false,
  }),
}

const getWrapper = (mockResolvers = mockResolver) => {
  const tree = renderWithWrappers(<TestRenderer />)
  act(() => {
    mockEnv.mock.resolveMostRecentOperation((operation) => {
      return MockPayloadGenerator.generate(operation, mockResolvers)
    })
  })
  return tree
}

beforeEach(() => {
  mockEnv = createMockEnvironment()
})

describe("OpenInquiryModalButtonQueryRenderer", () => {
  describe("OpenInquiryModalButton Query Renderer Component", () => {
    it("renders make offer button", () => {
      const tree = getWrapper()

      expect(extractText(tree.root)).toContain("Make Offer")
      expect(tree.root.findAllByType(OpenInquiryModalButtonContainer)).toHaveLength(1)
    })
    it("does not render make offer button for for works not elibable for inquiry checkout", () => {
      const tree = getWrapper(uneligibleArtworkMockResolver)

      expect(tree.root.findAllByType(OpenInquiryModalButtonContainer)).toHaveLength(0)
      expect(extractText(tree.root)).not.toContain("Make Offer")
    })
  })

  describe("Artsy guarantee message ad link", () => {
    it("display the correct message", () => {
      const tree = getWrapper()

      expect(extractText(tree.root)).toContain("Only purchases completed with our secure checkout are protected")
      expect(tree.root.findAllByType(OpenInquiryModalButtonContainer)).toHaveLength(1)
    })

    it("navigates to the buyer guarantee page when tapped", () => {
      const tree = getWrapper()
      tree.root.findAllByType(Text)[1].props.onPress()

      expect(navigate).toHaveBeenCalledWith("/buyer-guarantee")
    })
  })
})
