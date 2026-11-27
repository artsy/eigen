import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistAboutRelatedGenesQuery } from "__generated__/ArtistAboutRelatedGenesQuery.graphql"
import { ArtistAboutRelatedGenes } from "app/Components/Artist/ArtistAbout/ArtistAboutRelatedGenes"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistAboutRelatedGenes", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutRelatedGenesQuery>({
    Component: ({ artist }) => <ArtistAboutRelatedGenes artist={artist!} />,
    query: graphql`
      query ArtistAboutRelatedGenesQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistAboutRelatedGenes_artist
        }
      }
    `,
  })

  it("renders", async () => {
    await renderWithRelay({ GeneConnection: () => ({ edges: genes }) })

    expect(screen.getByText("Related Categories")).toBeOnTheScreen()
    expect(screen.getByText("Gene1")).toBeOnTheScreen()
    expect(screen.getByText("Gene2")).toBeOnTheScreen()
  })

  it("navigates to the gene", async () => {
    await renderWithRelay({ GeneConnection: () => ({ edges: genes }) })

    await fireEvent.press(screen.getByText("Gene2"))
    expect(navigate).toHaveBeenCalledWith("href2")
  })

  it("tracks a tap on a gene", async () => {
    await renderWithRelay({
      Artist: () => ({ internalID: "artist-id", slug: "artist-slug" }),
      GeneConnection: () => ({ edges: genes }),
    })

    await fireEvent.press(screen.getByText("Gene2"))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
[
  {
    "action": "tappedGene",
    "context_module": "relatedCategories",
    "context_screen_owner_id": "artist-id",
    "context_screen_owner_slug": "artist-slug",
    "context_screen_owner_type": "artist",
    "destination_screen_owner_id": "id-2",
    "destination_screen_owner_type": "gene",
    "subject": "Gene2",
  },
]
`)
  })
})

const genes = [
  { node: { internalID: "id-1", name: "Gene1", href: "href1" } },
  { node: { internalID: "id-2", name: "Gene2", href: "href2" } },
]
