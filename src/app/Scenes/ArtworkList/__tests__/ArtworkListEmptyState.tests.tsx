import { screen } from "@testing-library/react-native"
import { ArtworkListEmptyState_Test_Query } from "__generated__/ArtworkListEmptyState_Test_Query.graphql"
import { ArtworkListEmptyState } from "app/Scenes/ArtworkList/ArtworkListEmptyState"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkListEmptyState", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkListEmptyState_Test_Query>({
    Component: (props) => {
      return <ArtworkListEmptyState me={props.me} refreshControl={<></>} />
    },
    query: graphql`
      query ArtworkListEmptyState_Test_Query {
        me {
          ...ArtworkListEmptyState_me @arguments(listID: "list-id")
        }
      }
    `,
  })

  it("should render correct texts for default artwork list", async () => {
    renderWithRelay({
      Me: () => ({ artworkList: { default: true } }),
    })

    const title = "Keep track of artworks you love"
    const description = "Select the heart on an artwork to save it or add it to a list."

    expect(screen.getByText(title)).toBeOnTheScreen()
    expect(screen.getByText(description)).toBeOnTheScreen()
  })

  it("should render correct texts for non-default artwork list", async () => {
    renderWithRelay({
      Me: () => ({ artworkList: { default: false } }),
    })

    const title = "Start curating your list of works"
    const description = "Add works from Saved Artworks or add new artworks as you browse."

    expect(screen.getByText(title)).toBeOnTheScreen()
    expect(screen.getByText(description)).toBeOnTheScreen()
  })

  describe("Shareability with partners", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtworkListOfferability: true })
    })

    it("renderes the EyeClosedIcon if not shareable with partners", async () => {
      renderWithRelay({
        Me: () => ({ artworkList: { default: false, shareableWithPartners: false } }),
      })

      expect(screen.getByLabelText("EyeClosedIcon")).toBeOnTheScreen()
    })

    it("does not render the EyeClosedIcon if shareable with partners", async () => {
      renderWithRelay({
        Me: () => ({ artworkList: { default: false, shareableWithPartners: true } }),
      })

      expect(screen.queryByLabelText("EyeClosedIcon")).not.toBeOnTheScreen()
    })
  })
})
