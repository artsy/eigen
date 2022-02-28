import { act, fireEvent, getDefaultNormalizer, within } from "@testing-library/react-native"
import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { emdash, LinkText, nbsp } from "palette"
import React from "react"
import { Text as RNText } from "react-native"
import { ReadMore } from "./ReadMore"

describe("ReadMore", () => {
  it("Doesn't show the 'Read more' link when the length of the text is < the number of characters allowed", () => {
    const { queryByText } = renderWithWrappersTL(<ReadMore maxChars={20} content="Small text." />)

    expect(queryByText("Small text.")).toBeTruthy()
  })

  it("Doesn't show the 'Read more' link when the length of the text is equal to the number of characters allowed", () => {
    const { queryByText } = renderWithWrappersTL(<ReadMore maxChars={11} content="Small text." />)

    expect(queryByText("Small text.")).toBeTruthy()
  })

  it("Shows the 'Read more' link when the length of the text is > the number of characters allowed", () => {
    const { getByText } = renderWithWrappersTL(<ReadMore maxChars={3} content="Small text." />)

    expect(getByText(/Sma/)).toBeTruthy()
    expect(
      getByText(`Read${nbsp}more`, {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
  })

  it("Renders markdown", () => {
    const { getByText } = renderWithWrappersTL(
      <ReadMore maxChars={11} content="Small [text](/artist/andy-warhol)." />
    )
    expect(within(getByText(/Small/)).getByText(/text/)).toBeTruthy()
  })

  it("Renders an em dash if the text has line breaks when not expanded", () => {
    const { UNSAFE_queryAllByType } = renderWithWrappersTL(
      // tslint:disable-next-line: jsx-curly-brace-presence
      <ReadMore maxChars={30} content={`Line break\n\nWhich should render an emdash`} />
    )

    expect(extractText(UNSAFE_queryAllByType(RNText)[2])).toContain(` ${emdash} Which should`)
  })

  it("Shows the 'Read more' link when the length of the text is > the number of characters allowed", () => {
    const { queryByText, getByText, UNSAFE_queryAllByType } = renderWithWrappersTL(
      <ReadMore
        maxChars={7}
        textStyle="new"
        content="This text is slightly longer than is allowed."
      />
    )

    expect(extractText(UNSAFE_queryAllByType(RNText)[0])).toBe(`This te... Read${nbsp}more`)
    expect(extractText(UNSAFE_queryAllByType(RNText)[1])).toBe(`Read${nbsp}more`)

    // Clicking "Read more" expands the text
    act(() =>
      fireEvent.press(
        getByText(`Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      )
    )

    expect(queryByText("This text is slightly longer than is allowed.")).toBeTruthy()
  })

  it("truncates correctly if there are links within the text", () => {
    const { getByText, UNSAFE_getAllByType } = renderWithWrappersTL(
      <ReadMore
        maxChars={7}
        textStyle="new"
        content="This [text](/artist/text) is slightly longer than is [allowed](/gene/allowed)."
      />
    )

    expect(within(getByText(/This/)).getByText(/te/)).toBeTruthy()
    expect(
      getByText(`Read${nbsp}more`, {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeTruthy()
    expect(UNSAFE_getAllByType(LinkText)).toHaveLength(2) // One for the `/artist/text` link, one for "Read more"

    // Clicking "Read more" expands the text
    act(() =>
      fireEvent.press(
        getByText(`Read${nbsp}more`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      )
    )

    expect(within(getByText(/This/)).getByText(/text/)).toBeTruthy()
    expect(within(getByText(/is slightly longer than is/)).getByText(/allowed/)).toBeTruthy()
    expect(UNSAFE_getAllByType(LinkText)).toHaveLength(2) // We still have 2 links, since we expanded to view one
  })

  it("opens links modally when specified", () => {
    const { UNSAFE_getAllByType } = renderWithWrappersTL(
      <ReadMore maxChars={7} content="Small [text](/artist/andy-warhol)." presentLinksModally />
    )

    act(() => fireEvent.press(UNSAFE_getAllByType(LinkText)[0]))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", { modal: true })
  })

  it("doesn't open links modally when not specified", () => {
    const { UNSAFE_getAllByType } = renderWithWrappersTL(
      <ReadMore maxChars={7} content="Small [text](/artist/andy-warhol)." />
    )

    act(() => fireEvent.press(UNSAFE_getAllByType(LinkText)[0]))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })
})
