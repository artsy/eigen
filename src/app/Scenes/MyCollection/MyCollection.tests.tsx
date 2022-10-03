import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Tab } from "../MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { MyCollectionContainer } from "./MyCollection"

jest.unmock("react-relay")

describe("MyCollection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<MyCollectionTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query MyCollectionTestsQuery @relay_test_operation {
            me {
              ...MyCollection_me
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.me) {
            return (
              <StickyTabPage
                tabs={[
                  {
                    title: "test",
                    content: <MyCollectionContainer me={props.me} />,
                  },
                ]}
              />
            )
          }
          return null
        }}
      />
    </ArtworkFiltersStoreProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()

    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableMyCollectionInsights: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
    return tree
  }

  const getZeroStateWrapper = () =>
    getWrapper({
      Me: () => ({
        myCollectionConnection: {
          edges: [],
        },
      }),
    })

  describe("collection is empty", () => {
    let tree: ReactTestRenderer

    beforeEach(() => {
      tree = getZeroStateWrapper()
    })

    it("shows zerostate", () => {
      expect(extractText(tree.root)).toContain("Your Art Collection in Your Pocket")
      expect(extractText(tree.root)).toContain(
        "Access market insights and manage  your collection online."
      )
    })

    it("navigates to MyCollectionArtworkForm when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(navigate).toHaveBeenCalledWith(
        "my-collection/artworks/new",
        expect.objectContaining({
          passProps: { mode: "add", onSuccess: expect.anything(), source: Tab.collection },
        })
      )
    })

    it("tracks analytics event when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "addCollectedArtwork",
          "context_module": "myCollectionHome",
          "context_owner_type": "myCollection",
          "platform": "mobile",
        },
      ]
    `)
    })
  })

  describe("collection is not empty", () => {
    let tree: ReactTestRenderer
    beforeEach(() => {
      tree = getWrapper()
    })

    it("renders without throwing an error", () => {
      expect(tree.root.findByType(StickyTabPageScrollView)).toBeDefined()
      expect(tree.root.findByType(InfiniteScrollMyCollectionArtworksGridContainer)).toBeDefined()
    })
  })

  describe("sorting and filtering", () => {
    it.skip("filters and sorts without crashing", async () => {
      renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          myCollectionConnection,
        }),
      })

      await applyFilter("Sort By", "Price Paid (High to Low)")
      await applyFilter("Artists", "Banksy")
      // await applyFilter("Rarity", "Unique")
      // await applyFilter("Medium", "Print")
      // await applyFilter("Price", "$0-1,000")
      // await applyFilter("Size", "Small (under 40cm)")
    })
  })
})

const applyFilter = async (filterName: string, filterOption: string) => {
  await flushPromiseQueue()
  fireEvent.press(screen.getByTestId("sort-and-filter-button"))
  fireEvent.press(screen.getByText(filterName))
  fireEvent.press(screen.getByText(filterOption))
  fireEvent.press(screen.getByText("Show Results"))
}

const myCollectionConnection = {
  edges: [
    {
      node: {
        id: "QXJ0d29yazo2MWMwOTk4ZWU0YjZjMzAwMGI3NmJmYjE=",
        medium: "Print",
        pricePaid: {
          minor: "2000",
        },
        attributionClass: {
          name: "Unique",
        },
        sizeBucket: null,
        width: 30,
        height: 20,
        artist: {
          name: "Banksy",
          internalID: "4dd1584de0091e000100207c",
          formattedNationalityAndBirthday: "British",
        },
      },
    },
  ],
}
