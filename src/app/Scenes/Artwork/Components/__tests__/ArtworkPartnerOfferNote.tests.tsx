import { screen } from "@testing-library/react-native"
import { ArtworkPartnerOfferNote_Test_Query } from "__generated__/ArtworkPartnerOfferNote_Test_Query.graphql"
import { ArtworkPartnerOfferNote } from "app/Scenes/Artwork/Components/ArtworkPartnerOfferNote"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkPartnerOfferNote", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkPartnerOfferNote_Test_Query>({
    Component: ({ artwork, me }) => (
      <ArtworkPartnerOfferNote
        artwork={artwork!}
        partnerOffer={extractNodes(me?.partnerOffersConnection)[0]}
      />
    ),
    query: graphql`
      query ArtworkPartnerOfferNote_Test_Query @relay_test_operation {
        artwork(id: "test-artwork") {
          ...ArtworkPartnerOfferNote_artwork
        }
        me {
          partnerOffersConnection(artworkID: "test-artwork", first: 1) {
            edges {
              node {
                ...ArtworkPartnerOfferNote_partnerOffer
              }
            }
          }
        }
      }
    `,
  })

  it("renders the note correctly", () => {
    renderWithRelay({
      Artwork: () => ({
        partner: { profile: { icon: { url: "https://testurl" } } },
      }),
      Me: () => ({
        partnerOffersConnection: {
          edges: [{ node: { note: "This is a note", isAvailable: true } }],
        },
      }),
    })

    expect(screen.getByLabelText("Partner icon")).toBeOnTheScreen()
    expect(screen.getByText("Note from the gallery")).toBeOnTheScreen()
    expect(screen.getByText("“This is a note”")).toBeOnTheScreen()
  })

  it("does not render anything if there is no note", () => {
    renderWithRelay({
      Artwork: () => ({ partner: { profile: { icon: { url: "https://testurl" } } } }),
      Me: () => ({
        partnerOffersConnection: { edges: [{ node: { note: null, isAvailable: true } }] },
      }),
    })

    expect(screen.queryByLabelText("Partner icon")).not.toBeOnTheScreen()
    expect(screen.queryByText("Note from the gallery")).not.toBeOnTheScreen()
    expect(screen.queryByText("“This is a note”")).not.toBeOnTheScreen()
  })

  it("does not render the partner icon if there is none", () => {
    renderWithRelay({
      Artwork: () => ({ partner: { profile: null } }),
      Me: () => ({
        partnerOffersConnection: {
          edges: [{ node: { note: "This is a note", isAvailable: true } }],
        },
      }),
    })

    expect(screen.queryByLabelText("Partner icon")).not.toBeOnTheScreen()
    expect(screen.getByText("Note from the gallery")).toBeOnTheScreen()
    expect(screen.getByText("“This is a note”")).toBeOnTheScreen()
  })

  it("does not render anything if there is no partner offer", () => {
    renderWithRelay({
      Artwork: () => ({ partner: { profile: { icon: { url: "https://testurl" } } } }),
      Me: () => ({ partnerOffersConnection: { edges: [] } }),
    })

    expect(screen.queryByLabelText("Partner icon")).not.toBeOnTheScreen()
    expect(screen.queryByText("Note from the gallery")).not.toBeOnTheScreen()
    expect(screen.queryByText("“This is a note”")).not.toBeOnTheScreen()
  })

  it("does not render anything if partner offer is not available", () => {
    renderWithRelay({
      Artwork: () => ({ partner: { profile: { icon: { url: "https://testurl" } } } }),
      Me: () => ({
        partnerOffersConnection: {
          edges: [{ node: { note: "This is a note", isAvailable: false } }],
        },
      }),
    })

    expect(screen.queryByLabelText("Partner icon")).not.toBeOnTheScreen()
    expect(screen.queryByText("Note from the gallery")).not.toBeOnTheScreen()
    expect(screen.queryByText("“This is a note”")).not.toBeOnTheScreen()
  })
})
