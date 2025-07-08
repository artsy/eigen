import { fireEvent, screen } from "@testing-library/react-native"
import { BiographyTestsQuery } from "__generated__/BiographyTestsQuery.graphql"
import { Biography, MAX_CHARS } from "app/Components/Artist/Biography"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Biography", () => {
  const { renderWithRelay } = setupTestWrapper<BiographyTestsQuery>({
    Component: ({ artist }) => <Biography artist={artist!} />,
    query: graphql`
      query BiographyTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...Biography_artist
        }
      }
    `,
    variables: { artistID: "test-artist-id" },
  })

  describe("when no biography text exists", () => {
    it("returns null and does not render", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: null,
        }),
      })

      expect(screen.toJSON()).toBeNull()
    })

    it("returns null when text is empty", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: "",
            credit: null,
          },
        }),
      })

      expect(screen.toJSON()).toBeNull()
    })
  })

  describe("when biography text exists without credit", () => {
    it("renders biography text without credit", () => {
      const biographyText = "This is a short biography about the artist."

      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: biographyText,
            credit: null,
          },
        }),
      })

      expect(screen.getByText(biographyText)).toBeOnTheScreen()
    })

    it("renders biography text when credit is empty string", () => {
      const biographyText = "This is a short biography about the artist."

      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: biographyText,
            credit: "",
          },
        }),
      })

      expect(screen.getByText(biographyText)).toBeOnTheScreen()
    })
  })

  describe("when biography text exists with credit", () => {
    it("renders biography text with credit appended with space", () => {
      const biographyText = "This is a biography about the artist."
      const credit = "Source: Museum of Modern Art"

      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: biographyText,
            credit: credit,
          },
        }),
      })

      expect(screen.getByText(`${biographyText} ${credit}`, { exact: false })).toBeOnTheScreen()
    })
  })

  describe("truncation behavior", () => {
    const longText = "a".repeat(MAX_CHARS + 20)

    it("shows Read More button when text is longer than MAX_CHARS", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: longText,
            credit: null,
          },
        }),
      })

      expect(screen.getByText("Read More")).toBeOnTheScreen()
    })

    it("does not show Read More button when text is shorter than MAX_CHARS", () => {
      const shortText = "Short biography text"

      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: shortText,
            credit: null,
          },
        }),
      })

      expect(screen.queryByText("Read More")).toBeNull()
    })

    it("shows truncated text initially when text is long", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: longText,
            credit: null,
          },
        }),
      })

      const truncatedText = longText.slice(0, MAX_CHARS)
      expect(screen.getByText(truncatedText, { exact: false })).toBeOnTheScreen()
    })
  })

  describe("expand/collapse functionality", () => {
    const longText = "a".repeat(MAX_CHARS + 20)

    it("expands text when Read More is pressed", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: longText,
            credit: null,
          },
        }),
      })

      fireEvent.press(screen.getByText("Read More"))

      expect(screen.getByText("Read Less")).toBeOnTheScreen()
      expect(screen.getByText(longText)).toBeOnTheScreen()
    })

    it("collapses text when Read Less is pressed", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: longText,
            credit: null,
          },
        }),
      })

      fireEvent.press(screen.getByText("Read More"))
      fireEvent.press(screen.getByText("Read Less"))

      expect(screen.getByText("Read More")).toBeOnTheScreen()
      const truncatedText = longText.slice(0, 250)
      expect(screen.getByText(truncatedText, { exact: false })).toBeOnTheScreen()
    })
  })

  describe("credit with long text", () => {
    const longText = "a".repeat(MAX_CHARS - 20)
    const credit = "Museum of Modern Art"

    it("includes credit in expanded state when text is long", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: longText,
            credit: credit,
          },
        }),
      })

      fireEvent.press(screen.getByText("Read More"))

      expect(screen.getByText(credit, { exact: false })).toBeOnTheScreen()
    })

    it("shows Read More button when text with credit exceeds MAX_CHARS", () => {
      renderWithRelay({
        Artist: () => ({
          biographyBlurb: {
            text: longText,
            credit: credit,
          },
        }),
      })

      expect(screen.getByText("Read More")).toBeOnTheScreen()
    })
  })
})
