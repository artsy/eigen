import { Sans, Serif, Theme } from "@artsy/palette"
import { mount, shallow } from "enzyme"
import React from "react"
import { ReadMore } from "../ReadMore"
import { LinkText } from "../Text/LinkText"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"

describe("ReadMore", () => {
  it("Doesn't show the 'Read more' link when the length of the text is < the number of characters allowed", () => {
    const component = shallow(<ReadMore maxChars={20} content="Small text." />)

    expect(component.find(Serif).length).toEqual(1)
    expect(component.find(Serif).text()).toEqual("Small text.")
    expect(component.find(Sans).length).toEqual(0)
  })

  it("Doesn't show the 'Read more' link when the length of the text is equal to the number of characters allowed", () => {
    const component = shallow(<ReadMore maxChars={11} content={"Small [text](/artist/andy-warhol)."} />)

    expect(component.find(Serif).length).toEqual(1)
    expect(component.find(Serif).text()).toEqual("Small text.")
    expect(component.find(Sans).length).toEqual(0)
  })

  it("Shows the 'Read more' link when the length of the text is > the number of characters allowed", () => {
    const component = mount(
      <Theme>
        <ReadMore maxChars={7} content={"This text is slightly longer than is allowed."} />
      </Theme>
    )

    expect(component.find(Serif).length).toEqual(1)
    expect(component.find(Serif).text()).toMatchInlineSnapshot(`"This te... Read more"`)
    expect(component.find(Sans).length).toEqual(1)

    // Clicking "Read more" expands the text
    component
      .find(LinkText)
      .props()
      .onPress()

    component.update()

    expect(component.find(Serif).text()).toEqual("This text is slightly longer than is allowed.")
    expect(component.find(Sans).length).toEqual(0)
  })

  it("truncates correctly if there are links within the text", () => {
    const component = mount(
      <Theme>
        <ReadMore
          maxChars={7}
          content={"This [text](/artist/text) is slightly longer than is [allowed](/gene/allowed)."}
        />
      </Theme>
    )

    expect(component.find(Serif).length).toEqual(1)
    expect(component.find(Serif).text()).toMatchInlineSnapshot(`"This te... Read more"`)
    expect(component.find(Sans).length).toEqual(1)
    expect(component.find(LinkText).length).toEqual(2) // One for the "text" link, one for "Read more"

    // Clicking "Read more" expands the text
    component
      .find(LinkText)
      .at(1)
      .props()
      .onPress()

    component.update()

    expect(component.find(Serif).text()).toEqual("This text is slightly longer than is allowed.")
    expect(component.find(Sans).length).toEqual(0)
    expect(component.find(LinkText).length).toEqual(2) // We still have 2 links, since we expanded to view one
  })

  it("opens links modally when specified", () => {
    const component = mount(
      <Theme>
        <ReadMore maxChars={7} content={"Small [text](/artist/andy-warhol)."} presentLinksModally={true} />
      </Theme>
    )
    // Clicking "Read more" expands the text
    component
      .find(LinkText)
      .at(0)
      .props()
      .onPress()

    expect(SwitchBoard.presentModalViewController).toHaveBeenCalledWith(expect.anything(), "/artist/andy-warhol")
  })

  it("doesn't open links modally when not specified", () => {
    const component = mount(
      <Theme>
        <ReadMore maxChars={7} content={"Small [text](/artist/andy-warhol)."} />
      </Theme>
    )
    // Clicking "Read more" expands the text
    component
      .find(LinkText)
      .at(0)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/artist/andy-warhol")
  })
})
