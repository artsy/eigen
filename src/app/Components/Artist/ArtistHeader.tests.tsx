import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistHeaderTestsQuery } from "__generated__/ArtistHeaderTestsQuery.graphql"
import { ArtistHeader, tracks } from "app/Components/Artist/ArtistHeader"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistHeader", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistHeaderTestsQuery>({
    Component: ({ artist }) => <ArtistHeader artist={artist!} />,
    query: graphql`
      query ArtistHeaderTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistHeader_artist
        }
      }
    `,
  })

  it("displays the artwork count for an artist when present", () => {
    renderWithRelay({ Artist: () => mockArtist })

    expect(screen.getByLabelText("Marcel cover image")).toBeOnTheScreen()
  })

  it("displays represented by list given verifiedRepresentatives", () => {
    const partner = {
      internalID: "representative-id",
      name: "Test representative",
      href: "representative-href",
      profile: { icon: { url: "image-url" } },
    }
    renderWithRelay({
      Artist: () => ({
        ...mockArtist,
        verifiedRepresentatives: [{ partner }],
      }),
    })

    const representative = screen.getByText("Test representative")
    expect(representative).toBeOnTheScreen()

    fireEvent.press(representative)
    expect(navigate).toHaveBeenCalledWith("representative-href")
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tracks.tappedVerifiedRepresentative(mockArtist as any, partner)
    )
  })
})

const mockArtist = {
  internalID: "some-id",
  id: "marcel-duchamp",
  slug: "marcel-duchamp",
  name: "Marcel",
  nationality: "French",
  birthday: "11/17/1992",
  counts: {
    artworks: 22,
  },
}
