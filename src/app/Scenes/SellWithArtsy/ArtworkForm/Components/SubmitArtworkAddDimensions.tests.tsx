import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkAddDimensions } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDimensions"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkAddDimensions", () => {
  it("shows and updates properly the dimensions inputs", () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkAddDimensions />,
    })

    const inputs = {
      height: screen.getByTestId("Submission_HeightInput"),
      width: screen.getByTestId("Submission_WidthInput"),
      depth: screen.getByTestId("Submission_DepthInput"),
    }
    expect(inputs.height).toBeOnTheScreen()
    expect(inputs.width).toBeOnTheScreen()
    expect(inputs.depth).toBeOnTheScreen()

    fireEvent.changeText(inputs.height, "20")
    fireEvent.changeText(inputs.width, "30")
    fireEvent.changeText(inputs.depth, "40")

    expect(inputs.height.props.value).toEqual("20")
    expect(inputs.width.props.value).toEqual("30")
    expect(inputs.depth.props.value).toEqual("40")
  })
})
