import { mount } from "enzyme"
import React from "react"
import { LargeSelect, SelectSmall } from "../Select"

const options = [
  {
    text: "First option",
    value: "firstOption",
  },
  {
    text: "Second option that is really long",
    value: "secondOption",
  },
]

describe("Select", () => {
  describe("LargeSelect", () => {
    it("renders the options provided", () => {
      const props = { options }
      const wrapper = mount(<LargeSelect {...props} />)
      expect(wrapper.find("option").length).toEqual(2)
    })

    it("renders some optional info", () => {
      const props = {
        description: "This is the description",
        error: "This is the error",
        options,
        title: "This is the title",
      }
      const wrapper = mount(<LargeSelect {...props} />)
      expect(wrapper.text()).toContain("This is the description")
      expect(wrapper.text()).toContain("This is the error")
      expect(wrapper.text()).toContain("This is the title")
    })

    it("can be marked required", () => {
      const props = {
        options,
        required: true,
        title: "This is the title",
      }
      const wrapper = mount(<LargeSelect {...props} />)
      expect(wrapper.find("Required").length).toEqual(1)
    })

    it("passes the name attr down to the raw node", () => {
      const name = "some_rails_thing"
      const props = { name, options }
      const wrapper = mount(<LargeSelect {...props} />)
      expect(wrapper.find("select").prop("name")).toEqual(name)
    })
  })

  describe("SelectSmall", () => {
    it("renders proper options with correct selected one", () => {
      const wrapper = mount(
        <SelectSmall options={options} selected="secondOption" />
      )

      expect(wrapper.find("option").length).toBe(2)
      expect(wrapper.find("select").props().value).toBe("secondOption")
    })

    it("triggers callback on change", () => {
      const spy = jest.fn()
      const wrapper = mount(<SelectSmall options={options} onSelect={spy} />)
      wrapper
        .find("option")
        .at(1)
        .simulate("change")
      expect(spy).toHaveBeenCalled()
    })

    it("supports title attribute and renders it properly", () => {
      const wrapper = mount(<SelectSmall options={options} title="Sort" />)

      expect(wrapper.html()).toContain("Sort:")
    })
  })
})
