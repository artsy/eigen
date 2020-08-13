import { mount } from "enzyme"
import React from "react"
import { Sup, Tab, Tabs } from "../Tabs"

describe("Tabs", () => {
  it("renders tabs by via name prop", () => {
    const wrapper = mount(
      <div>
        <Tabs>
          <Tab name="Overview" />
          <Tab name="CV" />
        </Tabs>
      </div>
    )

    expect(wrapper.html()).toContain("Overview")
    expect(wrapper.html()).toContain("CV")
  })

  it("sets a specific tab on mount", () => {
    const wrapper = mount(
      <div>
        <Tabs initialTabIndex={1}>
          <Tab name="Overview" />
          <Tab name="CV" />
        </Tabs>
      </div>
    )

    expect(wrapper.find("ActiveTabButton").html()).toContain("CV")
  })

  it("ignores empty tab when selecting default selected tab on mount", () => {
    const wrapper = mount(
      <div>
        <Tabs>
          {null}
          {false as any}
          <Tab name="CV" />
        </Tabs>
      </div>
    )

    expect(wrapper.find("ActiveTabButton").html()).toContain("CV")
  })

  it("toggls tab content on click", () => {
    const getWrapper = tabIndex =>
      mount(
        <div>
          <Tabs initialTabIndex={tabIndex}>
            <Tab name="Overview">Overview content</Tab>
            <Tab name="CV">CV content</Tab>
          </Tabs>
        </div>
      )

    expect(getWrapper(0).html()).not.toContain("CV content")
    expect(getWrapper(0).html()).toContain("Overview content")
    expect(getWrapper(1).html()).not.toContain("Overview content")
    expect(getWrapper(1).html()).toContain("CV content")
  })

  it("it triggers an onChange event on tab click", () => {
    const spy = jest.fn()
    const wrapper = mount(
      <div>
        <Tabs initialTabIndex={1} onChange={spy}>
          <Tab name="Overview" />
          <Tab name="CV" />
        </Tabs>
      </div>
    )

    expect(spy).not.toHaveBeenCalled()
    wrapper.find("TabButton").simulate("click")
    expect(spy).toHaveBeenCalled()
  })

  it("transforms tabs with custom elements wrappers", () => {
    const TabWrapper = tab => (
      <div className="foundTabWrapper" key={Math.random()}>
        {tab}
      </div>
    )
    const wrapper = mount(
      <div>
        <Tabs initialTabIndex={1} transformTabBtn={TabWrapper}>
          <Tab name="Overview" />
          <Tab name="CV" />
        </Tabs>
      </div>
    )

    expect(wrapper.html()).toContain("foundTabWrapper")
  })

  it("allows user to set separator between tabs", () => {
    const TabSeparator = (
      <div className="foundTabSeparator" key={Math.random()}>
        foo|bar
      </div>
    )
    const wrapper = mount(
      <div>
        <Tabs initialTabIndex={1} separator={TabSeparator}>
          <Tab name="Overview" />
          <Tab name="CV" />
        </Tabs>
      </div>
    )

    expect(wrapper.html()).toContain("foundTabSeparator")
    expect(wrapper.html()).toContain("foo|bar")
  })

  it("renders superscripts after tab text", () => {
    const wrapper = mount(
      <div>
        <Tabs justifyContent="center">
          <Tab
            name={
              <>
                Open
                <Sup>100</Sup>
              </>
            }
          />
          <Tab
            name={
              <>
                Ready to ship
                <Sup>4</Sup>
              </>
            }
          />
          <Tab name="Complete" />
        </Tabs>
      </div>
    )

    expect(wrapper.text()).toContain("Open100Ready to ship4Complete")
  })
})
