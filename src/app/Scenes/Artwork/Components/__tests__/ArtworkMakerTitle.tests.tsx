import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkMakerTitle_Test_Query } from "__generated__/ArtworkMakerTitle_Test_Query.graphql"
import { ArtworkMakerTitleFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkMakerTitle"
import { navigate } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkMakerTitle", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkMakerTitle_Test_Query>({
    Component: ({ artwork }) => <ArtworkMakerTitleFragmentContainer artwork={artwork!} />,
    query: graphql`
      query ArtworkMakerTitle_Test_Query {
        artwork(id: "test-artwork") {
          ...ArtworkMakerTitle_artwork
        }
      }
    `,
  })

  it("renders fields correctly", async () => {
    await renderWithRelay({
      Artwork: () => ({
        artists: [
          { name: "Andy Warhol", href: "https://testhref" },
          { name: "Jeff Koons", href: "https://testhref" },
          { name: "Damien Hirst", href: "https://testhref" },
          { name: "Another Artist", href: "https://testhref" },
          { name: "Bruce Kurtman", href: "https://testhref" },
          { name: "Wes Borland", href: "https://testhref" },
        ],
        culturalMaker: null,
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Andy Warhol,")).toBeOnTheScreen()
    expect(screen.getByText("Jeff Koons,")).toBeOnTheScreen()
    expect(screen.getByText("Damien Hirst,")).toBeOnTheScreen()
    expect(screen.getByText("3 more")).toBeOnTheScreen()
  })

  it("redirects to artist page when artist name is clicked", async () => {
    await renderWithRelay({
      Artwork: () => ({
        artists: [{ name: "Andy Warhol", href: "/artist/andy-warhol" }],
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText(/Andy Warhol/)).toBeOnTheScreen()
    await fireEvent.press(screen.getByText(/Andy Warhol/))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", {
      passProps: { verifiedRepresentativesCount: 1 },
    })
  })

  describe("for an artwork with more than 3 artists", () => {
    it("truncates artist names", async () => {
      await renderWithRelay({
        Artwork: () => ({
          artists: [
            { name: "Andy Warhol", href: "https://testhref" },
            { name: "Jeff Koons", href: "https://testhref" },
            { name: "Damien Hirst", href: "https://testhref" },
            { name: "Another Artist", href: "https://testhref" },
            { name: "Bruce Kurtman", href: "https://testhref" },
            { name: "Wes Borland", href: "https://testhref" },
          ],
          culturalMaker: null,
        }),
      })

      await flushPromiseQueue()
      expect(screen.getByText("Andy Warhol,")).toBeOnTheScreen()
      expect(screen.getByText("Jeff Koons,")).toBeOnTheScreen()
      expect(screen.getByText("Damien Hirst,")).toBeOnTheScreen()
      expect(screen.getByText("3 more")).toBeOnTheScreen()
      expect(screen.queryByText("Another Artist")).not.toBeOnTheScreen()
      expect(screen.queryByText("Bruce Kurtman")).not.toBeOnTheScreen()
      expect(screen.queryByText("Wes Borland")).not.toBeOnTheScreen()
    })

    it("shows truncated artist names when 'x more' is clicked", async () => {
      await renderWithRelay({
        Artwork: () => ({
          artists: [
            { name: "Andy Warhol", href: "https://testhref" },
            { name: "Jeff Koons", href: "https://testhref" },
            { name: "Damien Hirst", href: "https://testhref" },
            { name: "Another Artist", href: "https://testhref" },
            { name: "Bruce Kurtman", href: "https://testhref" },
            { name: "Wes Borland", href: "https://testhref" },
          ],
          culturalMaker: null,
        }),
      })

      await fireEvent.press(screen.getByText("3 more"))

      expect(screen.queryByText("3 more")).not.toBeOnTheScreen()
      expect(screen.getByText(/Another Artist/)).toBeOnTheScreen()
      expect(screen.getByText(/Bruce Kurtman/)).toBeOnTheScreen()
      expect(screen.getByText(/Wes Borland/)).toBeOnTheScreen()
    })
  })

  describe("for an artwork with less than 4 artists but more than 1", () => {
    it("doesn't truncate artist names", async () => {
      await renderWithRelay({
        Artwork: () => ({
          artists: [
            { name: "Andy Warhol", href: "https://testhref" },
            { name: "Jeff Koons", href: "https://testhref" },
            { name: "Damien Hirst", href: "https://testhref" },
          ],
          culturalMaker: null,
        }),
      })

      expect(screen.getByText("Andy Warhol,")).toBeOnTheScreen()
      expect(screen.getByText("Jeff Koons,")).toBeOnTheScreen()
      expect(screen.getByText("Damien Hirst")).toBeOnTheScreen()
      expect(screen.queryByText(/more/)).not.toBeOnTheScreen()
    })
  })

  describe("for an artwork with one artist", () => {
    it("renders artist name", async () => {
      await renderWithRelay({
        Artwork: () => ({
          artists: [{ name: "Andy Warhol", href: "https://testhref" }],
          culturalMaker: null,
        }),
      })

      expect(screen.getByText(/Andy Warhol/)).toBeOnTheScreen()
    })

    it("Artist name is not clickable if no href provided", async () => {
      await renderWithRelay({
        Artwork: () => ({
          artists: [{ name: "Andy Warhol", href: null }],
          culturalMaker: null,
        }),
      })

      expect(screen.getByText(/Andy Warhol/)).toBeOnTheScreen()
      expect(screen.getByHintText("Go to artist page")).toBeDisabled()
    })
  })

  describe("for an artwork with no artists but a cultural maker", () => {
    it("renders artist name", async () => {
      await renderWithRelay({
        Artwork: () => ({
          artists: [],
          culturalMaker: "18th century American",
        }),
      })

      expect(screen.getByText("18th century American")).toBeOnTheScreen()
    })
  })
})
