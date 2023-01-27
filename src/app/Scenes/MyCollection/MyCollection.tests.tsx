import { fireEvent, RenderResult, screen } from "@testing-library/react-native"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionContainer } from "./MyCollection"

describe("MyCollection", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return (
          <ArtworkFiltersStoreProvider>
            <StickyTabPage
              tabs={[
                {
                  title: "test",
                  content: <MyCollectionContainer me={props.me} />,
                },
              ]}
            />
          </ArtworkFiltersStoreProvider>
        )
      }
      return null
    },
    query: graphql`
      query MyCollectionTestsQuery @relay_test_operation {
        me {
          ...MyCollection_me
        }
      }
    `,
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("collection is empty", () => {
    let tree: RenderResult

    beforeEach(() => {
      tree = renderWithRelay({
        Me: () => ({
          myCollectionConnection: {
            edges: [],
          },
        }),
      })
    })

    it("shows zerostate", () => {
      expect(tree.getByText).toContain("Your Art Collection in Your Pocket")
      expect(tree.getByText).toContain("Access market insights and manage your collection online.")
    })

    it("navigates to MyCollectionArtworkForm when Add Artwork is pressed", () => {
      const addArtworkButton = tree.UNSAFE_getByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(navigate).toHaveBeenCalledWith(
        "my-collection/artworks/new",
        expect.objectContaining({
          passProps: { mode: "add", onSuccess: expect.anything(), source: Tab.collection },
        })
      )
    })

    it("tracks analytics event when Add Artwork is pressed", () => {
      const addArtworkButton = tree.UNSAFE_getByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
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
    it("renders without throwing an error", () => {
      const tree = renderWithRelay()
      expect(tree.UNSAFE_getByType(StickyTabPageScrollView)).toBeDefined()
      expect(tree.UNSAFE_getByType(InfiniteScrollMyCollectionArtworksGridContainer)).toBeDefined()
    })
  })

  describe("sorting and filtering", () => {
    it.skip("filters and sorts without crashing", async () => {
      renderWithRelay({
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
