import { ArtistConsignButtonTestsQuery } from "__generated__/ArtistConsignButtonTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { cloneDeep } from "lodash"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistConsignButtonFragmentContainer, tests } from "./ArtistConsignButton"

jest.unmock("react-relay")

describe("ArtistConsignButton", () => {
  let env: ReturnType<typeof createMockEnvironment>

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
            <GlobalStoreProvider>
              <ArtistConsignButtonFragmentContainer artist={props.artist as any} />
            </GlobalStoreProvider>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
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
            url: "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=75&height=66&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FbrHdWfNxoereaVk2VOneuw%2Flarge.jpg",
          },
        },
        id: "QXJ0aXN0OjRkOGQxMjBjODc2YzY5N2FlMTAwMDA0Ng==",
      },
    }

    it("renders microfunnel correctly", () => {
      const tree = renderWithWrappers(<TestRenderer />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "ArtistConsignButtonTestsQuery"
      )
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
      const tree = renderWithWrappers(<TestRenderer />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "ArtistConsignButtonTestsQuery"
      )
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
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        const responseWithImage = cloneDeep(response)

        const responseWithoutImage = {
          ...responseWithImage,
          artist: {
            image: null,
          },
        }
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: responseWithoutImage,
        })
      })
      const image = tree.root.findAllByType(tests.Image)
      expect(image).toHaveLength(0)
    })

    it("tracks clicks on outer container", async () => {
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(mockTrackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/sales",
      })
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
      const tree = renderWithWrappers(<TestRenderer />)
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
      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(mockTrackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/sales",
      })
    })
  })

  describe("Navigation", () => {
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

    it("sends user to sales tab if not already there", () => {
      __globalStoreTestUtils__?.injectState({
        bottomTabs: { sessionState: { selectedTab: "home" } },
      })

      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()

      expect(navigate).toHaveBeenCalledWith("/sales", {
        passProps: { overwriteHardwareBackButtonPath: "search" },
      })
    })

    it("sends user to a new instance of landing page if user is already in sales tab", () => {
      __globalStoreTestUtils__?.injectState({
        bottomTabs: { sessionState: { selectedTab: "sell" } },
      })

      const tree = renderWithWrappers(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()

      expect(navigate).toHaveBeenCalledWith("/collections/my-collection/marketing-landing")
    })
  })
})
