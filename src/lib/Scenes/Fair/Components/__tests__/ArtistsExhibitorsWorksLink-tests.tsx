import React from "react"
import * as renderer from "react-test-renderer"
import { ArtistsExhibitorsWorksLink } from "../ArtistsExhibitorsWorksLink"

const onViewAllExhibitorsPressed = jest.fn()
const data = {
  onViewAllExhibitorsPressed,
}
describe("ArtistsExhibitorsWorksLink", () => {
  it("renders without throwing an error", () => {
    renderer.create(<ArtistsExhibitorsWorksLink {...(data as any)} />)
  })

  it("passes a function as a prop when clicked", () => {
    const component = renderer.create(<ArtistsExhibitorsWorksLink {...(data as any)} />).getInstance()
    component.props.onViewAllExhibitorsPressed()
    expect(onViewAllExhibitorsPressed).toHaveBeenCalled()
  })
})
