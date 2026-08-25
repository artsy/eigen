import { screen } from "@testing-library/react-native"
import { CityGuideFairEventSection } from "app/Scenes/CityGuide/Components/CityGuideFairEventSection"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const data = [
  {
    name: "TEFAF New York Fall 2019",
    id: "RmFpcjp0ZWZhZi1uZXcteW9yay1mYWxsLTIwMTk=",
    gravityID: "tefaf-new-york-fall-2019",
    image: {
      aspect_ratio: 1,
      url: "https://d32dm0rphc51dk.cloudfront.net/3cn9Ln3DfEnHxJcjvfBNKA/wide.jpg",
    },
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
  },
] as any[]

describe("CityGuideFairEventSection", () => {
  it("renders properly", () => {
    renderWithWrappers(<CityGuideFairEventSection data={data} citySlug="tefaf-new-york-fall-2019" />)

    expect(screen.getByText("TEFAF New York Fall 2019")).toBeTruthy()
  })
})
