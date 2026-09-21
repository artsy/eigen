import { screen } from "@testing-library/react-native"
import { CityGuideMetaData } from "app/Scenes/CityGuide/Components/CityGuideMetaData"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideMetaData", () => {
  it("renders the city name", () => {
    renderWithWrappers(<CityGuideMetaData cityName="London" />)

    expect(screen.getByText("London")).toBeOnTheScreen()
  })
})
