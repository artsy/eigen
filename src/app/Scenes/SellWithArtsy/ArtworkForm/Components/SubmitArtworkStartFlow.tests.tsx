import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkStartFlow } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkStartFlow"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

const mockNavigateToNextStep = jest.fn()
jest.mock("app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers", () => ({
  useSubmissionContext: () => {
    return {
      navigateToNextStep: mockNavigateToNextStep,
    }
  },
}))

describe("SubmitArtworkStartFlow", () => {
  it("Start a New Submission button works properly", () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkStartFlow />,
    })

    const startSubmissionButton = screen.getByText("Start a New Submission")
    expect(startSubmissionButton).toBeOnTheScreen()

    fireEvent(startSubmissionButton, "onPress")

    expect(mockNavigateToNextStep).toHaveBeenCalledWith("SelectArtist")
  })

  it("start from My Collection button works properly", () => {
    renderWithSubmitArtworkWrapper({
      component: <SubmitArtworkStartFlow />,
    })

    const startFromMyCollectionButton = screen.getByText("Start from My Collection")
    expect(startFromMyCollectionButton).toBeOnTheScreen()

    fireEvent(startFromMyCollectionButton, "onPress")

    expect(mockNavigateToNextStep).toHaveBeenCalledWith()
  })
})
