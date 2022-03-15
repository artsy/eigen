import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { MyCollectionWhySellTestsQuery } from "__generated__/MyCollectionWhySellTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { Button, Text } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionWhySell } from "./MyCollectionWhySell"

jest.unmock("react-relay")

describe("MyCollectionWhySell", () => {
  let env = createMockEnvironment()

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<MyCollectionWhySellTestsQuery>
      environment={env}
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

  const getWrapper = (mockResolvers = {}) => {
    // const tree = renderWithWrappers(<TestRenderer />)
    const wrapper = renderWithWrappersTL(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return wrapper
  }

  describe("MyCollectionWhySell banner behavior", () => {
    /* it("renders correct component", () => {
      const tree = getWrapper({ mockProps })
      expect(tree.root.findByType(MyCollectionWhySell)).toBeDefined()
    }) */

    describe("P1 artist", () => {
      const { getByTestId } = getWrapper({ mockPropsP1 })

      it("navigates to the sales page when learn more button is pressed", () => {
        const button = getByTestId("submitArtworkToSellButton")
        fireEvent.press(button)
        button.props.onPress()
        expect(navigate).toBeCalledWith("/collections/my-collection/artworks/new/submissions/new")
      })

      it("navigates to the FAQ screen when learn more link is pressed", () => {
        const button = getByTestId("learnMoreLink")
        fireEvent.press(button)
        expect(navigate).toBeCalledWith("/selling-with-artsy")
      })
    })

    describe("NOT P1 artist", () => {
      const tree = getWrapper({ mockPropsNotP1 })

      /*  it("navigates to sales page when learn more button is pressed", () => {
        const button = tree.root.findByType(Button)
        button.props.onPress()
        expect(navigate).toBeCalledWith("/sales")
      })
 */
      // Analytics
      let trackEvent: (data: Partial<{}>) => void
      beforeEach(() => {
        trackEvent = useTracking().trackEvent
      })

      /* it("tracks an analytics event learn more button is pressed", async () => {
        const button = tree.root.findByProps({ testID: "learnMoreButton" })
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
      }) */
    })
  })
})

const mockArtwork = {
  internalID: "61ee9a54503019000d761232",
  slug: "61ee9a54503019000d761232",
  title: "Welcome Mat",
  date: "2019",
  medium: "Photography",
  artist: {
    internalID: "4dd1584de0091e000100207c",
    name: "Banksy",
  },
  attributionClass: {
    name: "Unique",
  },
  editionNumber: null,
  editionSize: null,
  metric: "cm",
  height: "12",
  width: "13",
  depth: "13",
  provenance: "The Provenance",
  artworkLocation: "Berlin",
}

const mockPropsP1 = {
  isP1Artist: true,
  artwotk: {
    internalID: "someInternalId",
    slug: "someSlug",
    artist: {
      targetSupply: { isP1: true },
    },
  },
}

const mockPropsNotP1 = {
  isP1Artist: false,
  artwotk: {
    internalID: "someInternalId",
    slug: "someSlug",
    artist: {
      targetSupply: { isP1: false },
    },
  },
}
