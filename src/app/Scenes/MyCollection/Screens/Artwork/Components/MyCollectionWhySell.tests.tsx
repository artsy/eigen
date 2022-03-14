import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { MyCollectionWhySellTestsQuery } from "__generated__/MyCollectionWhySellTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionWhySell } from "./MyCollectionWhySell"

jest.unmock("react-relay")

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
          return <MyCollectionWhySell artwork={props?.artwork} />
        }
        return null
      }}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("MyCollectionWhySell banner behavior", () => {
    it("renders correct component", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      const mockProps = {
        Artwork: () => ({
          artwotk: {
            internalID: "someInternalId",
            slug: "someSlug",
          },
        }),
      }
      mockEnvironmentPayload(mockEnvironment, mockProps)
      expect(tree.root.findByType(MyCollectionWhySell)).toBeDefined()
    })

    it("navigates to sales page when learn more button is pressed", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      const mockProps = {
        Artwork: () => ({
          artwotk: {
            internalID: "someInternalId",
            slug: "someSlug",
          },
        }),
      }
      mockEnvironmentPayload(mockEnvironment, mockProps)
      const button = tree.root.findByType(Button)
      button.props.onPress()
      expect(navigate).toBeCalledWith("/sales")
    })

    // Analytics
    let trackEvent: (data: Partial<{}>) => void
    beforeEach(() => {
      trackEvent = useTracking().trackEvent
    })
    it("tracks an analytics event learn more button is pressed", async () => {
      const tree = renderWithWrappers(<TestRenderer />)
      const mockProps = {
        Artwork: () => ({
          artwotk: {
            internalID: "someInternalId",
            slug: "someSlug",
          },
        }),
      }
      mockEnvironmentPayload(mockEnvironment, mockProps)
      const button = tree.root.findByType(Button)
      button.props.onPress()
      await flushPromiseQueue()
      expect(trackEvent).toHaveBeenCalled()
      expect(trackEvent).toHaveBeenCalledWith({
        action: ActionType.tappedShowMore,
        context_module: ContextModule.sellFooter,
        context_screen_owner_type: OwnerType.myCollectionArtwork,
        context_screen_owner_id: "internalID-1",
        context_screen_owner_slug: "slug-1",
        subject: "Learn More",
      })
    })
  })
})
