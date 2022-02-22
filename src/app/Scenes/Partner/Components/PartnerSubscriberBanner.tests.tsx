import { fireEvent } from "@testing-library/react-native"
import * as navigate from "app/navigation/navigate"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { PartnerSubscriberBanner } from "./PartnerSubscriberBanner"

const partner = { name: "Cool Gallery", hasFairPartnership: false }

describe("CustomPriceInput", () => {
  const TestWrapper = (props: any) => {
    return <PartnerSubscriberBanner {...props} />
  }

  it("correctly displays title when gallery has fair partnership", () => {
    const { findByText } = renderWithWrappersTL(
      <TestWrapper partner={{ ...partner, hasFairPartnership: true }} />
    )
    expect(
      findByText(
        "Cool Gallery participated in Artsy’s art fair coverage but does not have a full profile."
      )
    ).toBeTruthy()
  })

  it("correctly displays title when gallery does not have fair partnership", () => {
    const { findByText } = renderWithWrappersTL(<TestWrapper partner={partner} />)
    expect(
      findByText("Cool Gallery is not currently an Artsy partner and does not have a full profile.")
    ).toBeTruthy()
  })

  it(`displays "Are you a representative of Cool Gallery?"`, () => {
    const { findByText } = renderWithWrappersTL(<TestWrapper partner={{ partner }} />)
    expect(findByText("Are you a representative of Cool Gallery?")).toBeTruthy()
  })

  it(`renders link which navigates to "https://partners.artsy.net/gallery-partnerships"`, () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper partner={partner} />)
    const navigateSpy = jest.spyOn(navigate, "navigate")
    const link = getByText("Learn about Artsy gallery partnerships.")
    expect(link).toBeTruthy()
    fireEvent.press(link)
    expect(navigateSpy).toHaveBeenCalledWith("https://partners.artsy.net/gallery-partnerships")
  })
})
