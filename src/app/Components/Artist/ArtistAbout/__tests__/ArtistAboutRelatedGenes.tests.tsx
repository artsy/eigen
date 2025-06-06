import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistAboutRelatedGenesQuery } from "__generated__/ArtistAboutRelatedGenesQuery.graphql"
import { ArtistAboutRelatedGenes } from "app/Components/Artist/ArtistAbout/ArtistAboutRelatedGenes"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistAboutRelatedGenes", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutRelatedGenesQuery>({
    Component: ({ artist }) => {
      const genes = extractNodes(artist?.related?.genes)
      return <ArtistAboutRelatedGenes genes={genes} />
    },
    query: graphql`
      query ArtistAboutRelatedGenesQuery @relay_test_operation {
        artist(id: "artist-id") {
          related {
            genes {
              edges {
                node {
                  ...ArtistAboutRelatedGenes_genes
                }
              }
            }
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({ GeneConnection: () => ({ edges: genes }) })

    expect(screen.getByText("Related Categories")).toBeOnTheScreen()
    expect(screen.getByText("Gene1")).toBeOnTheScreen()
    expect(screen.getByText("Gene2")).toBeOnTheScreen()
  })

  it("navigates to the gene", () => {
    renderWithRelay({ GeneConnection: () => ({ edges: genes }) })

    fireEvent.press(screen.getByText("Gene2"))
    expect(navigate).toHaveBeenCalledWith("href2")
  })
})

const genes = [
  { node: { internalID: "id-1", name: "Gene1", href: "href1" } },
  { node: { internalID: "id-2", name: "Gene2", href: "href2" } },
]
