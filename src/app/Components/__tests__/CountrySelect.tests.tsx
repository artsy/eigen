import { screen } from "@testing-library/react-native"
import { COUNTRY_SELECT_OPTIONS, CountrySelect } from "app/Components/CountrySelect"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CountrySelect", () => {
  it("renders correctly", () => {
    renderWithWrappers(<CountrySelect onSelectValue={() => {}} value="DE" />)

    expect(screen.getByText("Germany")).toBeTruthy()
  })
})

describe("CountrySelect Options", () => {
  it("contains expected country options", () => {
    // Verify that common countries are in the options
    const countries = ["United States", "United Kingdom", "France", "Germany", "Japan", "China"]

    countries.forEach((country) => {
      const found = COUNTRY_SELECT_OPTIONS.find((option) => option.label === country)
      expect(found).toBeTruthy()
    })
  })

  it("has the correct number of countries", () => {
    // There should be a reasonable number of countries in the list
    expect(COUNTRY_SELECT_OPTIONS.length).toBeGreaterThan(190)
  })

  it("includes searchTerms for countries", () => {
    // Check that countries have searchTerms that include their code
    const us = COUNTRY_SELECT_OPTIONS.find((option) => option.value === "US")
    expect(us?.searchTerms).toContain("US")
    expect(us?.searchTerms).toContain("USA")

    const uk = COUNTRY_SELECT_OPTIONS.find((option) => option.value === "GB")
    expect(uk?.searchTerms).toContain("GB")
    expect(uk?.searchTerms).toContain("UK")
  })
})
