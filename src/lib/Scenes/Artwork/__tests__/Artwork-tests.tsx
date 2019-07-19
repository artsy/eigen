import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { useTracking } from "react-tracking"
import { Artwork } from "../Artwork"
import { ArtworkHeader } from "../Components/ArtworkHeader"

const trackEvent = jest.fn()

describe("Artwork", () => {
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("renders a snapshot", () => {
    const component = mount(
      <Artwork artwork={ArtworkFixture} safeAreaInsets={{ top: 20, left: 0, right: 0, bottom: 0 }} />
    )
    expect(component.find(ArtworkHeader).length).toEqual(1)
  })
})
