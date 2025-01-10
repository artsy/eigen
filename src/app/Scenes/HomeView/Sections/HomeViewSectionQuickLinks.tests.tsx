import { fireEvent, screen } from "@testing-library/react-native"
import {
  HomeViewSectionQuickLinks,
  Pills,
} from "app/Scenes/HomeView/Sections/HomeViewSectionQuickLinks"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("HomeViewSectionQuickLinks", () => {
  it("renders a list of pills", () => {
    renderWithWrappers(<HomeViewSectionQuickLinks />)

    Pills.forEach((pill) => {
      expect(screen.getByText(pill.title)).toBeTruthy()
    })
  })

  it("navigates to the pill href", () => {
    renderWithWrappers(<HomeViewSectionQuickLinks />)

    Pills.forEach((pill) => {
      fireEvent.press(screen.getByText(pill.title))
      expect(navigate).toHaveBeenCalledWith(pill.href)
    })
  })
})
