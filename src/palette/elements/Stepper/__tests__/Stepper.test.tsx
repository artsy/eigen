import { mount } from "enzyme"
import React from "react"
import { Step, Stepper } from "../Stepper"

describe("Stepper", () => {
  const getWrapper = (props = {}) => {
    const _props = {
      initialTabIndex: 0,
      currentStepIndex: 0,
      disableNavigation: false,
      ...props,
    }

    return mount(
      <Stepper {..._props}>
        <Step name="Review" />
        <Step name="Confirm" />
        <Step name="Pay" />
      </Stepper>
    )
  }

  it("shows no checkmarks initially", () => {
    const wrapper = getWrapper()
    expect(wrapper.find("CheckIcon").length).toBe(0)
  })

  it("shows checkmarks after selected", () => {
    const wrapper = getWrapper({
      currentStepIndex: 2,
    })
    expect(wrapper.find("CheckIcon").length).toBe(2)
  })

  it("disables stepper", () => {
    const wrapper = getWrapper({
      disableNavigation: true,
    })
    expect(wrapper.find("DisabledStepButton").length).toBe(2)
  })
})
