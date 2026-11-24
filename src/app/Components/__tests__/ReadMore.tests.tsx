import { nbsp, emdash } from "@artsy/palette-mobile"
import { fireEvent, getDefaultNormalizer, screen, within } from "@testing-library/react-native"
import { ReadMore } from "app/Components/ReadMore"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ReadMore", () => {
  describe("when AREnableEnrichedMarkdown is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: false })
    })

    it("Doesn't show the 'Read more' link when the length of the text is < the number of characters allowed", async () => {
      await renderWithWrappers(<ReadMore maxChars={20} content="Small text." />)

      expect(screen.getByText("Small text.")).toBeOnTheScreen()
    })

    it("Doesn't show the 'Read more' link when the length of the text is equal to the number of characters allowed", async () => {
      await renderWithWrappers(<ReadMore maxChars={11} content="Small text." />)

      expect(screen.getByText("Small text.")).toBeOnTheScreen()
    })

    it("Shows the 'Read more' link when the length of the text is > the number of characters allowed", async () => {
      await renderWithWrappers(<ReadMore maxChars={3} content="Small text." />)

      expect(screen.getByText(/Sma/)).toBeTruthy()
      expect(
        screen.getByText(`Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      ).toBeTruthy()
    })

    it("Renders markdown", async () => {
      await renderWithWrappers(
        <ReadMore maxChars={11} content="Small [text](/artist/andy-warhol)." />
      )
      expect(within(screen.getByText(/Small/)).getByText(/text/)).toBeTruthy()
    })

    it("Renders an em dash if the text has line breaks when not expanded", async () => {
      await renderWithWrappers(
        <ReadMore maxChars={30} content={`Line break\n\nWhich should render an emdash`} />
      )

      expect(
        screen.getAllByText(new RegExp(`^ ${emdash} Which should`), {
          normalizer: getDefaultNormalizer({ trim: false, collapseWhitespace: false }),
        })[0]
      ).toBeOnTheScreen()
    })

    it("Shows the 'Read more' link when the length of the text is > the number of characters allowed", async () => {
      await renderWithWrappers(
        <ReadMore
          maxChars={7}
          textStyle="new"
          content="This text is slightly longer than is allowed."
        />
      )

      expect(
        screen.getByText(`This te... Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      ).toBeOnTheScreen()

      // Clicking "Read more" expands the text
      await fireEvent.press(
        screen.getByText(`Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      )

      expect(screen.getByText("This text is slightly longer than is allowed.")).toBeOnTheScreen()
    })

    it("truncates correctly if there are links within the text", async () => {
      await renderWithWrappers(
        <ReadMore
          maxChars={7}
          textStyle="new"
          content="This [text](/artist/text) is slightly longer than is [allowed](/gene/allowed)."
        />
      )

      expect(screen.getByText(/This te/)).toBeTruthy()
      expect(
        screen.getByText(`Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      ).toBeTruthy()
      // One link for `/artist/text`, plus the "Read more" link
      expect(screen.getAllByTestId(/^linktext-/)).toHaveLength(1)
      // v14 names an element by its accessibilityLabel only, not by its text content
      expect(screen.getByRole("button", { name: "Read More" })).toBeOnTheScreen()

      // Clicking "Read more" expands the text
      await fireEvent.press(
        screen.getByText(`Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      )

      expect(within(screen.getByText(/This/)).getByText(/text/)).toBeTruthy()
      expect(
        within(screen.getByText(/is slightly longer than is/)).getByText(/allowed/)
      ).toBeTruthy()
      // We still have 2 links, since we expanded to view one and "Read more" went away
      expect(screen.getAllByTestId(/^linktext-/)).toHaveLength(2)
      expect(screen.queryByRole("button", { name: `Read${nbsp}more` })).not.toBeOnTheScreen()
    })

    it("opens links modally when specified", async () => {
      await renderWithWrappers(
        <ReadMore maxChars={7} content="Small [text](/artist/andy-warhol)." presentLinksModally />
      )

      await fireEvent.press(screen.getAllByTestId(/^linktext-/)[0])

      expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", { modal: true })
    })

    it("doesn't open links modally when not specified", async () => {
      await renderWithWrappers(
        <ReadMore maxChars={7} content="Small [text](/artist/andy-warhol)." />
      )

      await fireEvent.press(screen.getAllByTestId(/^linktext-/)[0])

      expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
    })

    it("renders ordered list numbering, including a custom start number", async () => {
      const content = "42. An item\n42. Another item\n42. Yet another item\n"

      await renderWithWrappers(<ReadMore maxChars={10000} content={content} />)

      expect(screen.getByText("42.")).toBeTruthy()
      expect(screen.getByText("43.")).toBeTruthy()
      expect(screen.getByText("44.")).toBeTruthy()
      expect(screen.getByText("An item")).toBeTruthy()
      expect(screen.getByText("Another item")).toBeTruthy()
      expect(screen.getByText("Yet another item")).toBeTruthy()
    })

    it("doesn't break when it gets a text with dashes and special characters", async () => {
      const text = "- first \n- second \n- third \n * star \n & another one \n ' whatarethose"

      await renderWithWrappers(<ReadMore maxChars={7} content={text} />)

      // this parses as a real markdown list, so the bullet and the truncated item content
      // render as separate text nodes rather than one combined string
      expect(screen.queryByText(text)).toBeFalsy()
      expect(screen.getByText("• ")).toBeTruthy()
      expect(screen.getByText(/first/)).toBeTruthy()

      await fireEvent.press(screen.getByText(/Read more/))

      // after pressing read more, read more goes away and the rest of the list items are displayed
      expect(screen.getByText(/second/)).toBeTruthy()
      expect(screen.getByText(/whatarethose/)).toBeTruthy()
      expect(screen.queryByText(/Read more/)).toBeFalsy()
    })
  })

  describe("when AREnableEnrichedMarkdown is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: true })
    })

    it("renders the line-clamped markdown version", async () => {
      await renderWithWrappers(<ReadMore maxChars={20} content="Small text." />)

      expect(screen.getByTestId("read-more-content")).toBeOnTheScreen()
      expect(screen.getAllByText("Small text.").length).toBeGreaterThan(0)
    })

    it("expands the content when the clamped text overflows and 'Read more' is pressed", async () => {
      const onExpand = jest.fn()
      await renderWithWrappers(
        <ReadMore
          maxChars={7}
          content="This text is slightly longer than is allowed."
          onExpand={onExpand}
        />
      )

      const layout = (height: number) => ({
        nativeEvent: { layout: { height, width: 300, x: 0, y: 0 } },
      })
      await fireEvent(
        screen.getByTestId("read-more-measure", { includeHiddenElements: true }),
        "layout",
        layout(200)
      )
      await fireEvent(screen.getByTestId("read-more-content"), "layout", layout(40))

      await fireEvent.press(screen.getByText("Read more"))

      expect(onExpand).toHaveBeenCalledWith(true)
      expect(screen.queryByText("Read more")).not.toBeOnTheScreen()
    })

    it("passes presentLinksModally through to the markdown renderer", async () => {
      await renderWithWrappers(
        <ReadMore maxChars={100} content="Small [text](/artist/andy-warhol)." presentLinksModally />
      )

      await fireEvent.press(screen.getAllByText("text")[0])

      expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", { modal: true })
    })
  })
})
