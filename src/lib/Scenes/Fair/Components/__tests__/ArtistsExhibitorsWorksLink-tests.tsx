import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtistsExhibitorsWorksLink } from "../ArtistsExhibitorsWorksLink"

const onViewAllExhibitorsPressed = jest.fn()
const data = {
  onViewAllExhibitorsPressed,
}
describe("ArtistsExhibitorsWorksLink", () => {
  it("renders without throwing an error", () => {
    renderWithWrappers(<ArtistsExhibitorsWorksLink {...(data as any)} />)
  })

  it("passes a function as a prop when clicked", () => {
    const wrappedComponent = renderWithWrappers(<ArtistsExhibitorsWorksLink {...(data as any)} />)
    const component = wrappedComponent.root.findByType(ArtistsExhibitorsWorksLink).instance
    component.props.onViewAllExhibitorsPressed()
    expect(onViewAllExhibitorsPressed).toHaveBeenCalled()
  })
})
