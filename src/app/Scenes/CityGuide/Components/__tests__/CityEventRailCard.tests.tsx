import { fireEvent, screen } from "@testing-library/react-native"
import { CityEventRailCard } from "app/Scenes/CityGuide/Components/CityEventRailCard"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventRailCard", () => {
  const props = {
    image: "https://example.com/show.jpg",
    title: "One Fly Makes No Summer",
    href: "/show/one-fly-makes-no-summer",
    meta: "Jul 31 - Aug 29, 2026",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the title and the date line", () => {
    renderWithWrappers(<CityEventRailCard {...props} />)

    expect(screen.getByText("One Fly Makes No Summer")).toBeOnTheScreen()
    expect(screen.getByText("Jul 31 - Aug 29, 2026")).toBeOnTheScreen()
  })

  it("renders the admission line when given one", () => {
    renderWithWrappers(<CityEventRailCard {...props} admission="Paid Entry" />)

    expect(screen.getByText("Paid Entry")).toBeOnTheScreen()
  })

  // The designs arch the top of an Opening Soon image, and leave a Current Shows one square.
  it("arches the top of the image only when asked to", () => {
    renderWithWrappers(<CityEventRailCard {...props} />)

    expect(screen.getByTestId("city-event-rail-card-image")).toHaveStyle({
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    })

    screen.unmount()
    renderWithWrappers(<CityEventRailCard {...props} archTopImage />)

    expect(screen.getByTestId("city-event-rail-card-image")).toHaveStyle({
      borderTopLeftRadius: 80,
      borderTopRightRadius: 80,
    })
  })

  // Opening Soon cards pass no admission.
  it("renders no admission line when not given one", () => {
    renderWithWrappers(<CityEventRailCard {...props} />)

    expect(screen.queryByText("Free")).not.toBeOnTheScreen()
    expect(screen.queryByText("Paid Entry")).not.toBeOnTheScreen()
  })

  it("navigates to the href when tapped", () => {
    renderWithWrappers(<CityEventRailCard {...props} />)

    fireEvent.press(screen.getByText("One Fly Makes No Summer"))

    expect(navigate).toHaveBeenCalledWith("/show/one-fly-makes-no-summer")
  })
})
