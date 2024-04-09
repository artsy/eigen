import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkList_Test_Query } from "__generated__/ArtworkList_Test_Query.graphql"
import { ArtworkListScreen } from "app/Scenes/ArtworkList/ArtworkList"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const CONTEXTUAL_MENU_LABEL = "Contextual Menu Button"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
  Popover: (props: any) => <MockedPopover {...props} />,
}))

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

    it("should display the Popover when user clicks the EyeClosedIcon", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: false } }),
      })

      fireEvent.press(screen.getByLabelText("EyeClosedIcon"))

      expect(
        screen.getByText(
          "Artworks in this list are only visible to you and not eligible to receive offers."
        )
      ).toBeOnTheScreen()
    })

    it("should dismiss the Popover when the user clicks the EyeClosedIcon", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: false } }),
      })

      fireEvent.press(screen.getByLabelText("EyeClosedIcon"))

      expect(
        screen.getByText(
          "Artworks in this list are only visible to you and not eligible to receive offers."
        )
      ).toBeOnTheScreen()

      fireEvent.press(screen.getByLabelText("EyeClosedIcon"))

      expect(
        screen.queryByText(
          "Artworks in this list are only visible to you and not eligible to receive offers."
        )
      ).not.toBeOnTheScreen()
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

const MockedPopover: React.FC<any> = ({ children, onDismiss, visible, title }) => {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      <Text onPress={onDismiss}>
        <>{title}</>
        <>{children}</>
      </Text>
    </>
  )
}
