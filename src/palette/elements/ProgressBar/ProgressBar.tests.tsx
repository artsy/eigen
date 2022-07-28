import { screen, waitFor } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { withReanimatedTimer } from "react-native-reanimated/src/reanimated2/jestUtils"
import { ProgressBar } from "./ProgressBar"

describe("ProgressBar", () => {
  it("does not display the track view when progress is zero", () => {
    withReanimatedTimer(async () => {
      renderWithWrappers(<ProgressBar progress={0} />)

      const container = screen.getByTestId("progress-bar")
      const track = screen.getByTestId("progress-bar-track")

      expect(container.props.width).toEqual("100%")

      // width of 0% is invisible
      await waitFor(() => expect(track.props.style.width).toEqual("0%"))
    })
  })

  it("display the track view when progress is above zero", () => {
    withReanimatedTimer(async () => {
      renderWithWrappers(<ProgressBar progress={50} />)

      const container = screen.getByTestId("progress-bar")
      const track = screen.getByTestId("progress-bar-track")

      expect(container.props.width).toEqual("100%")

      // width of 50% is visible
      await waitFor(() => expect(track.props.style.width).toEqual("50%"))
    })
  })
})
