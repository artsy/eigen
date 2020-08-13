import { mount } from "enzyme"
import React from "react"
import { Dialog } from "../Dialog"

describe("Dialog", () => {
  it("displays provided title and action and shown by default", () => {
    const component = mount(
      <Dialog
        primaryCta={{
          action: () => null,
          text: "Continue",
        }}
        title="Make up your mind"
      />
    )
    expect(component.html()).toContain("Make up your mind")
    expect(component.html()).toContain("Continue")
  })

  it("is not shown when `show` is false", () => {
    const component = mount(
      <Dialog
        primaryCta={{
          action: () => null,
          text: "Continue",
        }}
        title="Make up your mind"
        show={false}
      />
    )
    expect(component.html()).toBeNull
  })

  it("calls primaryCta action on button click", () => {
    const cta = {
      action: jest.fn(),
      text: "Continue",
    }
    const component = mount(
      <Dialog primaryCta={cta} title="Make up your mind" />
    )
    expect(cta.action).not.toHaveBeenCalled()
    const ctaButton = component.find('div[children="Continue"]')
    expect(ctaButton.length).toBe(1)
    ctaButton.simulate("click")
    expect(cta.action).toHaveBeenCalled()
  })

  it("displays details if provided", () => {
    const component = mount(
      <Dialog
        primaryCta={{
          action: () => null,
          text: "Continue",
        }}
        detail="You take the blue pill or You take the red pill"
        title="Make up your mind"
      />
    )
    expect(component.html()).toContain("Make up your mind")
    expect(component.html()).toContain("Continue")
    expect(component.html()).toContain(
      "You take the blue pill or You take the red pill"
    )
  })

  it("displays secondaryCta if provided", () => {
    const component = mount(
      <Dialog
        primaryCta={{
          action: () => null,
          text: "Red pill",
        }}
        secondaryCta={{
          action: () => null,
          text: "Blue pill",
        }}
        detail="After this, there is no turning back"
        title="This is your last chance"
      />
    )
    expect(component.html()).toContain("This is your last chance")
    expect(component.html()).toContain("After this, there is no turning back")
    expect(component.html()).toContain("Red pill")
    expect(component.html()).toContain("Blue pill")
  })

  it("calls secondaryCta action on button click", () => {
    const redPill = {
      action: jest.fn(),
      text: "Red pill",
    }
    const bluePill = {
      action: jest.fn(),
      text: "Blue pill",
    }
    const component = mount(
      <Dialog
        primaryCta={redPill}
        secondaryCta={bluePill}
        title="Make up your mind"
      />
    )
    expect(redPill.action).not.toHaveBeenCalled()
    expect(bluePill.action).not.toHaveBeenCalled()
    const blueButton = component.find('div[children="Blue pill"]')
    expect(blueButton.length).toBe(1)
    blueButton.simulate("click")
    expect(redPill.action).not.toHaveBeenCalled()
    expect(bluePill.action).toHaveBeenCalled()
  })
})
