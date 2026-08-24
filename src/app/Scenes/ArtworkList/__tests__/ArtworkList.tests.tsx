import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
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

  /**
   * These cover the wiring only: picking an option dismisses the sheet, and the dismissal
   * refetches with the picked sort (or doesn't, when nothing changed).
   *
   * They deliberately do NOT guard against the stale-closure bug this wiring once had, and they
   * pass against that buggy implementation. Reproducing it needs a parent re-render to land
   * between the selection and the sheet's dismissal — production gets that for free during the
   * close animation, but a test would have to force it, which the current mock can't do with a
   * microtask. Don't mistake these for that regression guard.
   */
  describe("changing the sort option", () => {
    /**
     * Opens the sort sheet and picks an option. The sheet reports its dismissal asynchronously
     * (see the `@gorhom/bottom-sheet` mock in `setupJest`), which is what triggers the refetch,
     * so callers need to await the resulting operation.
     */
    const selectSortOption = (optionText: string) => {
      fireEvent.press(screen.getByText("Sort"))
      fireEvent.press(screen.getByText(optionText))
    }

    it("refetches with the picked sort value when the sheet is dismissed", async () => {
      const { env, mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({ Me: () => me })

      selectSortOption("First Added")

      await waitFor(() => {
        expect(env.mock.getMostRecentOperation().request.variables.sort).toBe("SAVED_AT_ASC")
      })
    })

    it("refetches again when the sort value is changed a second time", async () => {
      const { env, mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({ Me: () => me })

      selectSortOption("First Added")

      await waitFor(() => {
        expect(env.mock.getMostRecentOperation().request.variables.sort).toBe("SAVED_AT_ASC")
      })

      mockResolveLastOperation({ Me: () => me })

      selectSortOption("Recently Added")

      await waitFor(() => {
        expect(env.mock.getMostRecentOperation().request.variables.sort).toBe("SAVED_AT_DESC")
      })
    })

    it("does not refetch when re-selecting the already-selected sort value", async () => {
      const { env, mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({ Me: () => me })

      const operationCountBefore = env.mock.getAllOperations().length

      // "Recently Added" (SAVED_AT_DESC) is already the selected value
      selectSortOption("Recently Added")

      // Give the sheet's asynchronous dismissal a chance to trigger a refetch it shouldn't
      await waitFor(() => {
        expect(screen.getByText("Recently Added")).toBeOnTheScreen()
      })

      expect(env.mock.getAllOperations()).toHaveLength(operationCountBefore)
    })
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

    it("should display the HideIcon if not shareable with partners", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: false } }),
      })

      expect(screen.getByLabelText("HideIcon")).toBeOnTheScreen()
    })

    it("should NOT display the HideIcon if shareable with partners", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: true } }),
      })

      expect(screen.queryByLabelText("HideIcon")).not.toBeOnTheScreen()
    })

    it("should display the Popover when user clicks the HideIcon", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: false } }),
      })

      fireEvent.press(screen.getByLabelText("HideIcon"))

      expect(
        screen.getByText(
          "Artworks in this list are only visible to you and not eligible to receive offers."
        )
      ).toBeOnTheScreen()
    })

    it("should dismiss the Popover when the user clicks the HideIcon", async () => {
      const { mockResolveLastOperation } = renderWithRelay()

      mockResolveLastOperation({
        Me: () => ({ artworkList: { ...defaultArtworkList, shareableWithPartners: false } }),
      })

      fireEvent.press(screen.getByLabelText("HideIcon"))

      expect(
        screen.getByText(
          "Artworks in this list are only visible to you and not eligible to receive offers."
        )
      ).toBeOnTheScreen()

      fireEvent.press(screen.getByLabelText("HideIcon"))

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
