import { mount } from "enzyme"
import React from "react"

import { computeBorderColor, Input } from "./Input"

describe("Input", () => {
  it("returns a simple input with no options", () => {
    const wrapper = mount(<Input />)
    expect(wrapper.find("input").length).toEqual(1)
  })

  it("returns an input with title when provided", () => {
    const props = {
      title: "This is the title",
    }
    const wrapper = mount(<Input {...props} />)
    expect(wrapper.text()).toEqual(props.title)
  })

  it("returns a required input with title when provided both flags", () => {
    const props = {
      title: "This is the title",
      required: true,
    }
    const wrapper = mount(<Input {...props} />)
    expect(wrapper.find("Required").length).toEqual(1)
    expect(wrapper.text()).toEqual(props.title + "*")
  })

  it("returns an input with description when provided", () => {
    const props = {
      description: "This is the title",
    }
    const wrapper = mount(<Input {...props} />)
    expect(wrapper.text()).toEqual(props.description)
  })

  it("returns an input with error when provided", () => {
    const props = {
      error: "This is the title",
    }
    const wrapper = mount(<Input {...props} />)
    expect(wrapper.text()).toEqual(props.error)
  })
})

describe("computeBorderColor", () => {
  it("defaults to returning black 10", () => {
    const props = {
      disabled: null,
      error: null,
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("black10")
  })

  it("returns black10 when disabled", () => {
    const props = {
      disabled: true,
      error: false,
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("black10")
  })

  it("returns black10 when disabled and error", () => {
    const props = {
      disabled: true,
      error: true,
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("black10")
  })

  it("returns black10 when disabled and hover", () => {
    const props = {
      disabled: true,
      error: false,
      pseudo: "hover",
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("black10")
  })

  it("returns black10 when disabled and focus", () => {
    const props = {
      disabled: true,
      error: false,
      pseudo: "focus",
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("black10")
  })

  it("returns red100 when error", () => {
    const props = {
      disabled: false,
      error: true,
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("red100")
  })

  it("returns red100 when error and hover", () => {
    const props = {
      disabled: false,
      error: true,
      pseudo: "hover",
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("red100")
  })

  it("returns red100 when disabled and focus", () => {
    const props = {
      disabled: false,
      error: true,
      pseudo: "focus",
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("red100")
  })

  it("returns black60 on hover", () => {
    const props = {
      disabled: false,
      error: false,
      pseudo: "hover",
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("black60")
  })

  it("returns purple100 on focus", () => {
    const props = {
      disabled: false,
      error: false,
      pseudo: "focus",
    }
    const color = computeBorderColor(props)
    expect(color).toEqual("purple100")
  })
})
