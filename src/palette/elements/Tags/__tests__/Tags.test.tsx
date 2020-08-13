import { mount } from "enzyme"
import React from "react"
import { Tags } from "../Tags"

const props = {
  tags: [
    {
      name: "Sculpture",
      href: "/gene/sculpture",
    },
    {
      name: "Repetition",
      href: "/gene/repetition",
    },
    {
      name: "United States",
      href: "/gene/united-states",
    },
    {
      name: "1960s",
      href: "/gene/1960s",
    },
    {
      name: "Minimalism",
      href: "/gene/minimalism",
    },
    {
      name: "Abstract Art",
      href: "/gene/abstract-art",
    },
    {
      name: "Line, Form, and Color",
      href: "/gene/line-form-and-color",
    },
    {
      name: "1860–1969",
      href: "/gene/1860-1969",
    },
    {
      name: "Abstract Sculpture",
      href: "/gene/abstract-sculpture",
    },
    {
      name: "Linear Forms",
      href: "/gene/linear-forms",
    },
  ],
}
describe("Tags", () => {
  it("renders all tags", () => {
    const wrapper = mount(<Tags {...props} />)
    expect(wrapper.find("Tag").length).toBe(10)
    expect(wrapper.text()).toEqual(props.tags.map(tag => tag.name).join(""))
    expect(
      wrapper
        .find("Tag")
        .first()
        .prop("href")
    ).toEqual(props.tags[0].href)
  })
  it("shows more button when displayNum is passed", () => {
    const wrapper = mount(<Tags {...props} displayNum={5} />)
    expect(wrapper.find("Tag").length).toBe(5)
    const more = wrapper.find("MoreTag")
    expect(more.length).toBe(1)

    more.simulate("click")
    expect(wrapper.find("Tag").length).toBe(10)
  })
})
