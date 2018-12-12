import React from "react"
import * as renderer from "react-test-renderer"
import { ArtistsExhibitorsWorksLink } from "../ArtistsExhibitorsWorksLink"

const onViewAllExhibitorsPressed = jest.fn()
const data = {
  onViewAllExhibitorsPressed,
}
describe("ArtistsExhibitorsWorksLink", () => {
  it("Renders correctly", () => {
    const comp = renderer.create(<ArtistsExhibitorsWorksLink {...data as any} />)
    expect(comp).toMatchSnapshot()
  })
})
