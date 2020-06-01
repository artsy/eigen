import { Theme } from "@artsy/palette"
import { ArtistConsignButtonTestsQuery } from "__generated__/ArtistConsignButtonTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { cloneDeep } from "lodash"
import React from "react"
import { NativeModules, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistConsignButtonFragmentContainer, tests } from "../ArtistConsignButton"

jest.unmock("react-relay")

describe("ArtistConsignButton", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  const TestRenderer = () => (
    <QueryRenderer<ArtistConsignButtonTestsQuery>
      environment={env}
      query={graphql`
        query ArtistConsignButtonTestsQuery @relay_test_operation {
          artist(id: "alex-katz") {
            ...ArtistConsignButton_artist
          }
        }
      `}
      variables={{ id: "alex-katz" }}
      render={({ props, error }) => {
        if (props) {
          return (
            <Theme>
              <ArtistConsignButtonFragmentContainer
                // @ts-ignore STRICTNESS_MIGRATION
                artist={props.artist}
              />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })

    NativeModules.Emission.options.AROptionsMoveCityGuideEnableSales = false
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  describe("Top 20 Artist ('Microfunnel') or Target Supply button", () => {
    const response = {
      artist: {
        targetSupply: {
          isInMicrofunnel: true,
          isTargetSupply: true,
        },
        internalID: "fooBarBaz",
        slug: "alex-katz",
        name: "Alex Katz",
        href: "/artist/alex-katz",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=75&height=66&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FbrHdWfNxoereaVk2VOneuw%2Flarge.jpg",
          },
        },
        id: "QXJ0aXN0OjRkOGQxMjBjODc2YzY5N2FlMTAwMDA0Ng==",
      },
    }

    it("renders microfunnel correctly", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("ArtistConsignButtonTestsQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      expect(tree.root.findAllByType(tests.Image)).toHaveLength(1)
      expect(extractText(tree.root)).toContain("Sell your Alex Katz")
    })

    it("renders target supply correctly", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("ArtistConsignButtonTestsQuery")
      act(() => {
        const targetSupplyResponse = cloneDeep(response)
        targetSupplyResponse.artist.targetSupply.isInMicrofunnel = false
        targetSupplyResponse.artist.targetSupply.isTargetSupply = true
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: targetSupplyResponse,
        })
      })
      expect(tree.root.findAllByType(tests.Image)).toHaveLength(1)
      expect(extractText(tree.root)).toContain("Sell art from your collection")
    })

    it("guards against missing imageURL", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        const responseWithoutImage = cloneDeep(response)
        // @ts-ignore STRICTNESS_MIGRATION
        responseWithoutImage.artist.image = null
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: responseWithoutImage,
        })
      })
      const image = tree.root.findAllByType(tests.Image)
      expect(image).toHaveLength(0)
    })

    it("tracks clicks on outer container", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/consign/submission",
      })
    })

    // TODO: make this the default case once the feature flag is removed
    it("tracks the sales tab destination if feature flag is enabled", () => {
      NativeModules.Emission.options.AROptionsMoveCityGuideEnableSales = true

      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })

      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          destination_path: "/sales",
        })
      )
    })
  })

  describe("Button for artists not in Microfunnel", () => {
    const response: any = {
      artist: {
        targetSupply: {
          isInMicrofunnel: false,
          isTargetSupply: false,
        },
        internalID: "fooBarBaz",
        slug: "alex-katz",
        name: "Alex Katz",
        href: "/artist/alex-katz",
        id: "QXJ0aXN0OjRkOGQxMjBjODc2YzY5N2FlMTAwMDA0Ng==",
      },
    }

    it("renders with data", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      const image = tree.root.findAllByType(tests.Image)
      expect(image).toHaveLength(0)
      expect(extractText(tree.root)).toContain("Sell art from your collection")
    })

    it("tracks clicks on outer container", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/consign/submission",
      })
    })

    // TODO: make this the default case once the feature flag is removed
    it("tracks the sales tab destination if feature flag is enabled", () => {
      NativeModules.Emission.options.AROptionsMoveCityGuideEnableSales = true

      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })

      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          destination_path: "/sales",
        })
      )
    })
  })
})
