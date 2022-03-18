import { act, fireEvent } from "@testing-library/react-native"
import { MyCollectionWhySellTestsQuery } from "__generated__/MyCollectionWhySellTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionWhySell } from "./MyCollectionWhySell"

jest.unmock("react-relay")

const trackEvent = useTracking().trackEvent

describe("MyCollectionWhySell", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionWhySellTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionWhySellTestsQuery @relay_test_operation {
          artwork(id: "some-id") {
            ...MyCollectionWhySell_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionWhySell artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = (resolvers = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, resolvers)
    )
  }

  describe("P1 artwork", () => {
    it("navigates to the sale form when submit is press", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

      resolveData({
        Artwork: () => ({
          slug: "someSlug",
          internalID: "someInternalId",
          artist: {
            targetSupply: { isP1: true },
          },
        }),
      })
      const button = getByTestId("submitArtworkToSellButton")
      act(() => fireEvent.press(button))
      expect(navigate).toBeCalledWith("/collections/my-collection/artworks/new/submissions/new")
    })

    it("navigates to the explanatory page when learn more is press", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

      resolveData({
        Artwork: () => ({
          slug: "someSlug",
          internalID: "someInternalId",
          artist: {
            targetSupply: { isP1: true },
          },
        }),
      })
      const button = getByTestId("learnMoreLink")
      act(() => fireEvent.press(button))
      expect(navigate).toBeCalledWith("/selling-with-artsy")
    })

    // Analytics
    it("tracks an analytics event when submit is press is pressed", async () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      resolveData({
        Artwork: () => ({
          slug: "someSlug",
          internalID: "someInternalId",
          artist: {
            targetSupply: { isP1: true },
          },
        }),
      })
      const button = getByTestId("submitArtworkToSellButton")
      act(() => fireEvent.press(button))
      await flushPromiseQueue()
      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: "tappedSell",
        context_module: "sellFooter",
        context_screen_owner_type: "myCollectionArtwork",
        context_screen_owner_id: "someInternalId",
        context_screen_owner_slug: "someSlug",
        subject: "Submit This Artwork to Sell",
      })
    })
  })

  describe("not P1", () => {
    it("navigates to the sales page when learn more is press", () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)

      resolveData({
        Artwork: () => ({
          slug: "someSlug",
          internalID: "someInternalId",
          artist: {
            targetSupply: { isP1: false },
          },
        }),
      })
      const button = getByTestId("learnMoreButton")
      act(() => fireEvent.press(button))

      expect(navigate).toBeCalledWith("/sales")
    })

    // Analytics
    it("tracks an analytics event when learn more is press is pressed", async () => {
      const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
      resolveData({
        Artwork: () => ({
          slug: "someSlug",
          internalID: "someInternalId",
          artist: {
            targetSupply: { isP1: false },
          },
        }),
      })
      const button = getByTestId("learnMoreButton")
      act(() => fireEvent.press(button))
      await flushPromiseQueue()
      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: "tappedShowMore",
        context_module: "sellFooter",
        context_screen_owner_type: "myCollectionArtwork",
        context_screen_owner_id: "someInternalId",
        context_screen_owner_slug: "someSlug",
        subject: "Learn More",
      })
    })
  })
})
