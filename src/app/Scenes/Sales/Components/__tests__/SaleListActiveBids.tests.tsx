import { fireEvent, screen } from "@testing-library/react-native"
import { SaleListActiveBidsTestsQuery } from "__generated__/SaleListActiveBidsTestsQuery.graphql"
import { SaleListActiveBids } from "app/Scenes/Sales/Components/SaleListActiveBids"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SaleListActiveBids", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHidingDislikedArtworks: true })
  })

  const { renderWithRelay } = setupTestWrapper<SaleListActiveBidsTestsQuery>({
    Component: (props) => {
      return <SaleListActiveBids me={props.me} />
    },
    query: graphql`
      query SaleListActiveBidsTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...SaleListActiveBids_me
        }
      }
    `,
  })

  it("renders nothing when no artworks", () => {
    const { toJSON } = renderWithRelay({
      Me: () => ({
        lotStandings: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of artworks", () => {
    renderWithRelay({
      Me: () => ({
        lotStandings: [
          {
            saleArtwork: {
              artwork: {
                internalID: "artwork-1-id",
                slug: "artwork-1-slug",
                title: "Artwork 1",
                href: "/artwork-1-href",
              },
            },
          },
          {
            saleArtwork: {
              artwork: {
                internalID: "artwork-2-id",
                slug: "artwork-2-slug",
                title: "Artwork 2",
                href: "/artwork-2-href",
              },
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Your Active Bids")).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Artwork 2/))

    expect(navigate).toHaveBeenCalledWith("/artwork-2-href")
  })
})
