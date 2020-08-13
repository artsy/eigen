import { mount } from "enzyme"
import "jest-styled-components"
import React from "react"
import { color } from "../../helpers"
import { Theme } from "../../Theme"
import { BarChart, BarChartProps } from "../BarChart"
import { Flex } from "../Flex"
import { Sans } from "../Typography"
import { Bar } from "./Bar"

const mockBars = [
  { value: 100, axisLabelX: "x axis label" },
  { value: 1000, axisLabelX: <div id="x-axis">lol</div> },
  {
    value: 0,
    highlightLabel: (
      <Flex alignItems="center" flexDirection="column" id="highlight-label">
        <Sans weight="medium" size="2">
          $30,000
        </Sans>
        <Sans color={"black60"} size="2">
          This artwork
        </Sans>
      </Flex>
    ),
  },
  {
    value: 400,
    onClick: () => {
      window.open("https://calmingmanatee.com/")
    },
    onHover: () => {
      window.open("https://calmingmanatee.com/")
    },
    label: (
      <Flex alignItems="center" flexDirection="column">
        <Sans size="2" weight="medium">
          Sept 30
        </Sans>
        <Sans size="2" color="black60">
          423 views
        </Sans>
      </Flex>
    ),
  },
]

describe("BarChart", () => {
  const getWrapper = (props: Partial<BarChartProps> = {}) => {
    return mount(
      <Theme>
        <BarChart
          bars={mockBars}
          minLabel="min-label"
          maxLabel="max-label"
          {...props}
        />
      </Theme>
    )
  }

  it("renders the min and max labels", () => {
    const chart = getWrapper()

    expect(chart.text()).toContain("min-label")
    expect(chart.text()).toContain("max-label")
  })

  it("shows a highlightLabel all the time", () => {
    const chart = getWrapper({ bars: [mockBars[2]] })

    const label = chart.find("#highlight-label").hostNodes()

    expect(label.text()).toMatch("This artwork")
  })

  it("allows the min and max labels to be any old html", () => {
    const chart = getWrapper({
      minLabel: <div id="min">Hello min!</div>,
      maxLabel: <div id="max">Hello max!</div>,
    })

    expect(chart.find("#min").text()).toBe("Hello min!")
    expect(chart.find("#max").text()).toBe("Hello max!")
  })
  it("renders x axis labels labels", () => {
    const chart = getWrapper()

    expect(chart.text()).toContain("x axis label")
    expect(chart.find("#x-axis").text()).toBe("lol")
  })

  it("calls the onClick function is one is passed in when the bar is clicked", () => {
    window.open = jest.fn()
    const chart = getWrapper({ bars: [mockBars[3]] })
    chart
      .find(Bar)
      .at(0)
      .simulate("click")
    expect(window.open).toBeCalledWith("https://calmingmanatee.com/")
  })

  it("calls the onHover function is one is passed in when the bar is hovered over", () => {
    window.open = jest.fn()
    const chart = getWrapper({ bars: [mockBars[3]] })
    chart
      .find(Bar)
      .at(0)
      .simulate("mouseover")
    expect(window.open).toBeCalledWith("https://calmingmanatee.com/")
  })

  it("shows the correct number of bars", () => {
    const chart = getWrapper()
    expect(chart.find(Bar)).toHaveLength(mockBars.length)
  })

  it("defaults to showing a minimum-height bar if the artwork's highlighted bin is empty", () => {
    const chart = getWrapper()
    const highlightedBar = chart.find(Bar).at(2)
    const computedStyle = getComputedStyle(highlightedBar.getDOMNode())

    // Waiting for animation to finish
    setTimeout(() => {
      expect(computedStyle.getPropertyValue("height")).toMatch("10px")
    }, 1100)
  })

  it("shows the highlighted bar in a different color", () => {
    const chart = getWrapper()
    const normalBar = chart.find(Bar).at(0)
    const highlightedBar = chart.find(Bar).at(2)
    expect(normalBar).toHaveStyleRule("background", color("black10"))
    expect(highlightedBar).toHaveStyleRule("background", color("black60"))
  })

  it("does not show hover labels by default", () => {
    const chart = getWrapper()
    expect(chart.text()).not.toContain("423 views")
  })

  it("shows hover labels when you hover over the bar", () => {
    const chart = getWrapper()
    const labelledBar = chart
      .find(Bar)
      .last()
      .find("div")
      .first()
    labelledBar.simulate("mouseenter")
    expect(chart.text()).toContain("423 views")
    labelledBar.simulate("mouseleave")
    expect(chart.text()).not.toContain("423 views")
  })
})
