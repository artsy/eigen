import { Sans } from "@artsy/palette"
import { shallow } from "enzyme"
import { CountdownTimer } from "lib/Scenes/Fair/Components/FairHeader/CountdownTimer"
import React from "react"
import { BackgroundImage, ViewingRoomHeader } from "../ViewingRoomHeader"

describe("ViewingRoomHeader", () => {
  const imageUrl = "https://url.to/image.png"
  const title = "Viewing Room Title"
  it("renders a background image with the given image url", () => {
    const component = shallow(<ViewingRoomHeader artwork={imageUrl} title={title} />)
    expect(component.find(BackgroundImage).props().imageURL).toBe(imageUrl)
  })
  it("renders the given title", () => {
    const component = shallow(<ViewingRoomHeader artwork={imageUrl} title={title} />)
    expect(component.findWhere(n => n.type() === Sans && n.text() === title).length).toBe(1)
  })
  it("renders a countdown timer with hard-coded start and end times", () => {
    const component = shallow(<ViewingRoomHeader artwork={imageUrl} title={title} />)
    expect(component.find(CountdownTimer).props().startAt).toBe("2020-03-10T20:22:42+00:00")
    expect(component.find(CountdownTimer).props().endAt).toBe("2020-04-22T10:24:31+00:00")
  })
})
