// MeetYourNewAdvisorRail

import { fireEvent } from "@testing-library/react-native"
import { MeetYourNewAdvisorRail } from "app/Scenes/Home/Components/MeetYourNewAdvisorRail"
import { navigate, switchTab } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"

describe("MeetYourNewAdvisorRail", () => {
  const trackEvent = useTracking().trackEvent

  it("the first card is implemented correctly", () => {
    const { getByText } = renderWithWrappers(
      <MeetYourNewAdvisorRail title="Meet your new art advisor" />
    )

    fireEvent(getByText("Explore Works"), "press")

    expect(navigate).toHaveBeenCalledWith("/find-the-art-you-love")
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedProductCapabilitiesGroup",
      context_screen: "home",
      context_screen_owner_type: "home",
      context_module: "findTheArtYouWant",
    })
  })

  it("the second card is implemented correctly", () => {
    const { getByText } = renderWithWrappers(
      <MeetYourNewAdvisorRail title="Meet your new art advisor" />
    )

    fireEvent(getByText("Start Searching"), "press")

    expect(navigate).toHaveBeenCalledWith("/price-database")
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedProductCapabilitiesGroup",
      context_screen: "home",
      context_screen_owner_type: "home",
      context_module: "priceDatabase",
    })
  })

  it("the third card is implemented correctly", () => {
    const { getByText } = renderWithWrappers(
      <MeetYourNewAdvisorRail title="Meet your new art advisor" />
    )

    fireEvent(getByText("View My Collection"), "press")

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedProductCapabilitiesGroup",
      context_screen: "home",
      context_screen_owner_type: "home",
      context_module: "myCollection",
    })
  })

  it("the fourth card is implemented correctly", () => {
    const { getByText } = renderWithWrappers(
      <MeetYourNewAdvisorRail title="Meet your new art advisor" />
    )

    fireEvent(getByText("Learn more"), "press")

    expect(switchTab).toHaveBeenCalledWith("sell")
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedProductCapabilitiesGroup",
      context_screen: "home",
      context_screen_owner_type: "home",
      context_module: "sell",
    })
  })
})
