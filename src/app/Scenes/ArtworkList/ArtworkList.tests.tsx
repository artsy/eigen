import { screen } from "@testing-library/react-native"
import { ArtworkList_Test_Query } from "__generated__/ArtworkList_Test_Query.graphql"
import { ArtworkListScreen } from "app/Scenes/ArtworkList/ArtworkList"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const CONTEXTUAL_MENU_LABEL = "Contextual Menu Button"

describe("ArtworkList", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkList_Test_Query>({
    Component: (props) => {
      return <ArtworkListScreen {...(props as any)} />
    },
    query: graphql`
      query ArtworkList_Test_Query {
        me {
          ...ArtworkList_artworksConnection @arguments(listID: "id", count: 10)
        }
      }
    `,
  })

  it("renders ArtworkList", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ Me: () => me })

    expect(screen.getByText("Saved Artworks")).toBeOnTheScreen()
    expect(screen.getByText("2 Artworks")).toBeOnTheScreen()
  })

  it("displays the artworks", async () => {
    const { mockResolveLastOperation } = renderWithRelay()

    mockResolveLastOperation({ Me: () => me })

    expect(screen.getByText("Artwork Title 1")).toBeOnTheScreen()
    expect(screen.getByText("Artwork Title 2")).toBeOnTheScreen()
  })

  describe("Contextual menu button", () => {
    it("should NOT be displayed for default artwork list", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({ Me: () => me })

      expect(screen.queryByLabelText(CONTEXTUAL_MENU_LABEL)).not.toBeOnTheScreen()
    })

    it("should be displayed custom artwork list", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({ Me: () => ({ ...me, artworkList: customArtworkList }) })

      expect(screen.getByLabelText(CONTEXTUAL_MENU_LABEL)).toBeOnTheScreen()
    })

    it("should be displayed for custom artwork list empty state", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({
          ...me,
          artworkList: {
            ...customArtworkList,
            artworks: { ...customArtworkList.artworks, totalCount: 0 },
          },
        }),
      })

      expect(screen.getByLabelText(CONTEXTUAL_MENU_LABEL)).toBeOnTheScreen()
    })
  })

  describe("Artwork list shareability with partners", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworkListOfferability: true })
    })

    it("should display the EyeClosedIcon if not shareable with partners", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: false } }),
      })

      expect(screen.getByLabelText("EyeClosedIcon")).toBeOnTheScreen()
    })

    it("should NOT display the EyeClosedIcon if shareable with partners", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: true } }),
      })

      expect(screen.queryByLabelText("EyeClosedIcon")).not.toBeOnTheScreen()
    })
  })
})

const artworks = {
  totalCount: 2,
  edges: [
    {
      node: {
        title: "Artwork Title 1",
        internalID: "613a38d6611297000d7ccc1d",
      },
    },
    {
      node: {
        title: "Artwork Title 2",
        internalID: "614e4006f856a0000df1399c",
      },
    },
  ],
}

const defaultArtworkList = {
  internalID: "id-1",
  name: "Saved Artworks",
  default: true,
  artworks,
}

const customArtworkList = {
  internalID: "custom-artwork-list",
  name: "Custom Artwork List",
  default: false,
  artworks,
}

const me = {
  artworkList: defaultArtworkList,
}
