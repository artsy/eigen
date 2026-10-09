import { fireEvent, screen } from "@testing-library/react-native"
import {
  MarkdownText,
  buildMarkdownStyle,
  sanitizeMarkdown,
} from "app/Components/MarkdownText/MarkdownText"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MarkdownText", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the markdown content", () => {
    renderWithWrappers(<MarkdownText markdown={"First paragraph\n\nSecond paragraph"} />)

    expect(screen.getByText(/First paragraph/)).toBeOnTheScreen()
    expect(screen.getByText(/Second paragraph/)).toBeOnTheScreen()
  })

  it("renders list content", () => {
    renderWithWrappers(<MarkdownText markdown={"Intro\n\n- first item\n- second item\n"} />)

    expect(screen.getByText(/first item/)).toBeOnTheScreen()
    expect(screen.getByText(/second item/)).toBeOnTheScreen()
  })

  it("navigates when a link is pressed", () => {
    renderWithWrappers(<MarkdownText markdown="Go to [Andy Warhol](/artist/andy-warhol)" />)

    fireEvent.press(screen.getByText("Andy Warhol"))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("navigates modally when specified", () => {
    renderWithWrappers(
      <MarkdownText presentLinksModally markdown="Go to [Andy Warhol](/artist/andy-warhol)" />
    )

    fireEvent.press(screen.getByText("Andy Warhol"))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", { modal: true })
  })
})

describe(sanitizeMarkdown, () => {
  it("strips images", () => {
    expect(sanitizeMarkdown("Before ![alt](https://example.com/a.jpg) after")).toEqual(
      "Before  after"
    )
  })

  it("leaves links untouched", () => {
    expect(sanitizeMarkdown("[link](/artist/andy-warhol)")).toEqual("[link](/artist/andy-warhol)")
  })
})

describe(buildMarkdownStyle, () => {
  const theme = {
    theme: {
      fonts: {
        sans: {
          regular: "Unica77LL-Regular",
          italic: "Unica77LL-Italic",
          medium: "Unica77LL-Medium",
          mediumItalic: "Unica77LL-MediumItalic",
        },
      },
      textTreatments: {
        xs: { fontSize: 13, lineHeight: 20 },
        sm: { fontSize: 16, lineHeight: 26 },
        md: { fontSize: 20, lineHeight: 32 },
        lg: { fontSize: 26, lineHeight: 40 },
      },
    },
    color: (c: string) => `color:${c}`,
    space: (s: number) => s * 10,
  } as any

  it("maps the palette variant, color and alignment to the paragraph style", () => {
    const style = buildMarkdownStyle(theme, { variant: "xs", color: "mono60", textAlign: "center" })

    expect(style.paragraph).toMatchObject({
      fontFamily: "Unica77LL-Regular",
      fontSize: 13,
      lineHeight: 20,
      color: "color:mono60",
      textAlign: "center",
    })
  })

  it("uses palette font faces for strong and emphasis", () => {
    const style = buildMarkdownStyle(theme, {})

    expect(style.strong).toEqual({
      fontFamily: "Unica77LL-Medium",
      fontWeight: "normal",
      color: "color:onBackgroundHigh",
    })
    expect(style.em).toEqual({
      fontFamily: "Unica77LL-Italic",
      fontStyle: "normal",
      color: "color:onBackgroundHigh",
    })
  })

  it("keeps emphasis, headings, lists and links at the legacy colors when the text color changes", () => {
    const style = buildMarkdownStyle(theme, { color: "mono60" })

    expect(style.paragraph?.color).toEqual("color:mono60")
    expect(style.strong?.color).toEqual("color:onBackgroundHigh")
    expect(style.em?.color).toEqual("color:onBackgroundHigh")
    expect(style.h1?.color).toEqual("color:onBackgroundHigh")
    expect(style.list?.color).toEqual("color:onBackgroundHigh")
    expect(style.link?.color).toEqual("color:mono100")
  })

  it("only aligns paragraphs, keeping headings left aligned", () => {
    const style = buildMarkdownStyle(theme, { textAlign: "center" })

    expect(style.paragraph?.textAlign).toEqual("center")
    expect(style.h1?.textAlign).toBeUndefined()
    expect(style.h3?.textAlign).toBeUndefined()
  })

  it("applies emphasisColor and linkColor overrides", () => {
    const style = buildMarkdownStyle(theme, {
      color: "mono60",
      emphasisColor: "mono60",
      linkColor: "mono60",
    })

    expect(style.strong?.color).toEqual("color:mono60")
    expect(style.list?.color).toEqual("color:mono60")
    expect(style.link?.color).toEqual("color:mono60")
  })
})
