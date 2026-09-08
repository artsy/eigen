import { Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { CityEventRow } from "app/Scenes/CityGuide/Components/CityEventRow"
import { RouterLink } from "app/system/navigation/RouterLink"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityEventRow", () => {
  it("renders the title, subtitle and meta line", () => {
    renderWithWrappers(
      <CityEventRow
        title="Frida Kahlo"
        subtitle="Tate Modern"
        meta="Aug 24 – Sep 28, 2026"
        imageURL="https://example.com/a.jpg"
        href="/show/frida-kahlo"
      />
    )

    expect(screen.getByText("Frida Kahlo")).toBeTruthy()
    expect(screen.getByText("Tate Modern")).toBeTruthy()
    expect(screen.getByText("Aug 24 – Sep 28, 2026")).toBeTruthy()
  })

  it("renders without a subtitle or meta line", () => {
    renderWithWrappers(<CityEventRow title="Frida Kahlo" subtitle={null} meta={null} />)

    expect(screen.getByText("Frida Kahlo")).toBeTruthy()
    expect(screen.getByTestId("city-event-row")).toBeTruthy()
  })

  it("gives the RouterLink a flex style so it fills the row and the text has room", () => {
    // RouterLink renders a Touchable with no flex of its own, so inside a flexDirection="row"
    // parent it shrinks to fit its content and the title/subtitle/meta column collapses to
    // zero width. `style={{ flex: 1 }}` on the RouterLink is what fixes that.
    renderWithWrappers(
      <CityEventRow
        title="Frida Kahlo"
        subtitle="Tate Modern"
        meta="Aug 24 – Sep 28, 2026"
        href="/show/frida-kahlo"
      />
    )

    expect(screen.UNSAFE_getByType(RouterLink).props.style).toEqual({ flex: 1 })
  })

  it("renders whatever save control it is given", () => {
    renderWithWrappers(
      <CityEventRow title="Frida Kahlo" saveControl={<Text>stand-in control</Text>} />
    )

    expect(screen.getByText("stand-in control")).toBeTruthy()
  })
})
