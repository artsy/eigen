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
    renderWithRelay({
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

    expect(screen.queryByText("Andy Warhol,")).toBeTruthy()
    expect(screen.queryByText("Jeff Koons,")).toBeTruthy()
    expect(screen.queryByText("Damien Hirst,")).toBeTruthy()
    expect(screen.queryByText("3 more")).toBeTruthy()
  })

  it("redirects to artist page when artist name is clicked", async () => {
    renderWithRelay({
      Artwork: () => ({
        artists: [{ name: "Andy Warhol", href: "/artist/andy-warhol" }],
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByText(/Andy Warhol/)).toBeTruthy()
    fireEvent.press(screen.getByText(/Andy Warhol/))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", {
      passProps: { verifiedRepresentativesCount: 1 },
    })
  })

  describe("for an artwork with more than 3 artists", () => {
    it("truncates artist names", async () => {
      renderWithRelay({
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
      expect(screen.queryByText("Andy Warhol,")).toBeTruthy()
      expect(screen.queryByText("Jeff Koons,")).toBeTruthy()
      expect(screen.queryByText("Damien Hirst,")).toBeTruthy()
      expect(screen.queryByText("3 more")).toBeTruthy()
      expect(screen.queryByText("Another Artist")).toBeNull()
      expect(screen.queryByText("Bruce Kurtman")).toBeNull()
      expect(screen.queryByText("Wes Borland")).toBeNull()
    })

    it("shows truncated artist names when 'x more' is clicked", () => {
      renderWithRelay({
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

      fireEvent.press(screen.getByText("3 more"))

      expect(screen.queryByText("3 more")).toBeNull()
      expect(screen.queryByText(/Another Artist/)).toBeTruthy()
      expect(screen.queryByText(/Bruce Kurtman/)).toBeTruthy()
      expect(screen.queryByText(/Wes Borland/)).toBeTruthy()
    })
  })

  describe("for an artwork with less than 4 artists but more than 1", () => {
    it("doesn't truncate artist names", () => {
      renderWithRelay({
        Artwork: () => ({
          artists: [
            { name: "Andy Warhol", href: "https://testhref" },
            { name: "Jeff Koons", href: "https://testhref" },
            { name: "Damien Hirst", href: "https://testhref" },
          ],
          culturalMaker: null,
        }),
      })

      expect(screen.queryByText("Andy Warhol,")).toBeTruthy()
      expect(screen.queryByText("Jeff Koons,")).toBeTruthy()
      expect(screen.queryByText("Damien Hirst")).toBeTruthy()
      expect(screen.queryByText(/more/)).toBeNull()
    })
  })

  describe("for an artwork with one artist", () => {
    it("renders artist name", () => {
      renderWithRelay({
        Artwork: () => ({
          artists: [{ name: "Andy Warhol", href: "https://testhref" }],
          culturalMaker: null,
        }),
      })

      expect(screen.queryByText(/Andy Warhol/)).toBeTruthy()
    })

    it("Artist name is not clickable if no href provided", () => {
      renderWithRelay({
        Artwork: () => ({
          artists: [{ name: "Andy Warhol", href: null }],
          culturalMaker: null,
        }),
      })

      expect(screen.queryByText(/Andy Warhol/)).toBeTruthy()
      expect(screen.getByA11yHint("Go to artist page")).toBeDisabled()
    })
  })

  describe("for an artwork with no artists but a cultural maker", () => {
    it("renders artist name", () => {
      renderWithRelay({
        Artwork: () => ({
          artists: [],
          culturalMaker: "18th century American",
        }),
      })

      expect(screen.queryByText("18th century American")).toBeTruthy()
    })
  })
})
