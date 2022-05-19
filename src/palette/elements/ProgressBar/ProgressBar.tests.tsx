import { waitFor } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ProgressBar, ProgressBarProps } from "./ProgressBar"

describe("ProgressBar", () => {
  const getWrapper = (props: ProgressBarProps) => {
    return renderWithWrappersTL(<ProgressBar {...props} />)
  }

  it("does not display the track view when progress is zero", async () => {
    const wrapper = getWrapper({ progress: 0 })
    const container = wrapper.getByTestId("progress-bar")
    const track = wrapper.getByTestId("progress-bar-track")

    expect(container.props.width).toEqual("100%")
    // width of 0% is invisible
    await waitFor(() => expect(track.props.style.width).toEqual("0%"))
  })

  it("display the track view when progress is above zero", async () => {
    const wrapper = getWrapper({ progress: 50 })
    const container = wrapper.getByTestId("progress-bar")
    const track = wrapper.getByTestId("progress-bar-track")

    expect(container.props.width).toEqual("100%")
    // width of 50% is visible
    // wait for animations to finish running
    await waitFor(() => expect(track.props.style.width).toEqual("50%"))
  })
})
