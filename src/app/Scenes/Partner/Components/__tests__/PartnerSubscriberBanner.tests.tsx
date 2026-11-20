import { fireEvent, screen } from "@testing-library/react-native"
import { PartnerSubscriberBanner } from "app/Scenes/Partner/Components/PartnerSubscriberBanner"
import * as navigate from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const partner = { name: "Cool Gallery", hasFairPartnership: false }

// The banner renders its title, question and link inside a single `Text`, so match a substring.
const textMatch = (text: string) => new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

describe("CustomPriceInput", () => {
  const TestWrapper = (props: any) => {
    return <PartnerSubscriberBanner {...props} />
  }

  it("correctly displays title when gallery has fair partnership", async () => {
    await renderWithWrappers(<TestWrapper partner={{ ...partner, hasFairPartnership: true }} />)
    expect(
      await screen.findByText(
        textMatch(
          "Cool Gallery participated in Artsy’s art fair coverage but does not have a full profile."
        )
      )
    ).toBeOnTheScreen()
  })

  it("correctly displays title when gallery does not have fair partnership", async () => {
    await renderWithWrappers(<TestWrapper partner={partner} />)
    expect(
      await screen.findByText(
        textMatch(
          "Cool Gallery is not currently an Artsy partner and does not have a full profile."
        )
      )
    ).toBeOnTheScreen()
  })

  it(`displays "Are you a representative of Cool Gallery?"`, async () => {
    await renderWithWrappers(<TestWrapper partner={partner} />)
    expect(
      await screen.findByText(textMatch("Are you a representative of Cool Gallery?"))
    ).toBeOnTheScreen()
  })

  it(`renders link which navigates to "https://partners.artsy.net/gallery-partnerships"`, async () => {
    await renderWithWrappers(<TestWrapper partner={partner} />)
    const navigateSpy = jest.spyOn(navigate, "navigate")
    const link = screen.getByText("Learn about Artsy gallery partnerships.")
    expect(link).toBeTruthy()
    await fireEvent.press(link)
    expect(navigateSpy).toHaveBeenCalledWith("https://partners.artsy.net/gallery-partnerships")
  })
})
