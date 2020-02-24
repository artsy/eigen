import React from "react"
import * as renderer from "react-test-renderer"
import { ArtistsExhibitorsWorksLink } from "../ArtistsExhibitorsWorksLink"

const onViewAllExhibitorsPressed = jest.fn()
const data = {
  onViewAllExhibitorsPressed,
}
describe("ArtistsExhibitorsWorksLink", () => {
  it("Renders correctly", () => {
    const component = renderer.create(<ArtistsExhibitorsWorksLink {...data as any} />)
    expect(component).toMatchSnapshot()
  })

  it("passes a function as a prop when clicked", () => {
    const component = renderer.create(<ArtistsExhibitorsWorksLink {...data as any} />).getInstance()
    component.props.onViewAllExhibitorsPressed()
    expect(onViewAllExhibitorsPressed).toHaveBeenCalled()
  })
})
