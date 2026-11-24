import { fireEvent, screen } from "@testing-library/react-native"
import { MarkdownReadMore, linesFromMaxChars } from "app/Components/MarkdownText/MarkdownReadMore"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const layout = (height: number) => ({ nativeEvent: { layout: { height, width: 300, x: 0, y: 0 } } })

const measure = async ({ full, clamped }: { full: number; clamped: number }) => {
  await fireEvent(
    screen.getByTestId("read-more-measure", { includeHiddenElements: true }),
    "layout",
    layout(full)
  )
  await fireEvent(screen.getByTestId("read-more-content"), "layout", layout(clamped))
}

describe("MarkdownReadMore", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the content", async () => {
    await renderWithWrappers(
      <MarkdownReadMore maxChars={100} content="Some **markdown** content" />
    )

    expect(screen.getByText(/Some \*\*markdown\*\* content/)).toBeOnTheScreen()
  })

  it("doesn't show 'Read more' when the content fits within the clamp", async () => {
    await renderWithWrappers(<MarkdownReadMore maxChars={100} content="Short text" />)

    await measure({ full: 40, clamped: 40 })

    expect(screen.queryByText("Read more")).not.toBeOnTheScreen()
  })

  it("shows 'Read more' when the content overflows and expands on press", async () => {
    const onExpand = jest.fn()
    await renderWithWrappers(
      <MarkdownReadMore maxChars={10} content="A much longer text" onExpand={onExpand} />
    )

    await measure({ full: 200, clamped: 40 })
    await fireEvent.press(screen.getByText("Read more"))

    expect(onExpand).toHaveBeenCalledWith(true)
    expect(screen.queryByText("Read more")).not.toBeOnTheScreen()
  })

  it("shows 'Read Less' after expanding when enabled", async () => {
    const onExpand = jest.fn()
    await renderWithWrappers(
      <MarkdownReadMore
        maxChars={10}
        content="A much longer text"
        showReadLessButton
        onExpand={onExpand}
      />
    )

    await measure({ full: 200, clamped: 40 })
    await fireEvent.press(screen.getByText("Read more"))
    await fireEvent.press(screen.getByText("Read Less"))

    expect(onExpand).toHaveBeenLastCalledWith(false)
    expect(screen.getByText("Read more")).toBeOnTheScreen()
  })

  it("opens links modally when specified", async () => {
    await renderWithWrappers(
      <MarkdownReadMore
        maxChars={100}
        presentLinksModally
        content="About [Andy Warhol](/artist/andy-warhol)"
      />
    )

    await fireEvent.press(screen.getAllByText("Andy Warhol")[0])

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", { modal: true })
  })
})

describe(linesFromMaxChars, () => {
  it("converts characters to lines for the text variant", () => {
    expect(linesFromMaxChars(250, "sm")).toEqual(6)
    expect(linesFromMaxChars(250, "xs")).toEqual(5)
  })

  it("never clamps to fewer than two lines", () => {
    expect(linesFromMaxChars(10, "sm")).toEqual(2)
  })
})
