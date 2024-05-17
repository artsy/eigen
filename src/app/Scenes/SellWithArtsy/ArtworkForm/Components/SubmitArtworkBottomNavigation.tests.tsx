import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkBottomNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkBottomNavigation"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"

const mockNavigateToNextStep = jest.fn()
const mockNavigateToPreviousStep = jest.fn()
jest.mock("app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers", () => ({
  useSubmissionContext: () => {
    return {
      navigateToNextStep: mockNavigateToNextStep,
      navigateToPreviousStep: mockNavigateToPreviousStep,
    }
  },
}))

describe("SubmitArtworkBottomNavigation", () => {
  describe("When the current step is StartFlow", () => {
    it("Shows a functional Start a New Submission button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "StartFlow" },
      })

      const startSubmissionButton = screen.getByText("Start a New Submission")
      expect(startSubmissionButton).toBeOnTheScreen()

      fireEvent(startSubmissionButton, "onPress")

      expect(mockNavigateToNextStep).toHaveBeenCalledWith("SelectArtist")
    })

    it("Shows a functional Start from My Collection button", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableSubmitMyCollectionArtworkInSubmitFlow: true,
      })
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "StartFlow" },
      })

      const startFromMyCollectionButton = screen.getByText("Start from My Collection")
      expect(startFromMyCollectionButton).toBeOnTheScreen()

      fireEvent(startFromMyCollectionButton, "onPress")

      expect(mockNavigateToNextStep).toHaveBeenCalledWith()
    })
  })

  describe("When the current step is Complete your submission", () => {
    it("Shows a functional View or Edit Submission button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "CompleteYourSubmission" },
      })

      const viewOrEditSubmissionButton = screen.getByText("View or Edit Submission")
      expect(viewOrEditSubmissionButton).toBeOnTheScreen()

      // TODO: Update this test when the feature is implemented
    })

    it("Shows a functional Submit Another Artwork button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "CompleteYourSubmission" },
      })

      const submitAnotherArtworkButton = screen.getByText("Submit Another Artwork")
      expect(submitAnotherArtworkButton).toBeOnTheScreen()

      fireEvent(submitAnotherArtworkButton, "onPress")

      expect(navigate).toHaveBeenCalledWith("/sell/submissions/new", {
        replaceActiveScreen: true,
      })
    })
  })

  describe("When the current step is neither start flow nor complete your submission", () => {
    it("Shows a functional continue button", async () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "AddTitle" },
        injectedFormikProps: { title: "Some title" },
      })

      const continueButton = screen.getByText("Continue")
      expect(continueButton).toBeOnTheScreen()

      fireEvent(continueButton, "onPress")

      expect(mockNavigateToNextStep).toHaveBeenCalledWith()
    })

    it("Shows a functional back button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "AddTitle" },
        injectedFormikProps: { title: "Some title" },
      })

      const backButton = screen.getByText("Back")
      expect(backButton).toBeOnTheScreen()

      fireEvent(backButton, "onPress")

      expect(mockNavigateToPreviousStep).toHaveBeenCalledWith()
    })
  })
})
