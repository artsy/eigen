import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkBottomNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkBottomNavigation"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import {
  NAVIGATE_TO_NEXT_STEP_EVENT,
  NAVIGATE_TO_PREVIOUS_STEP_EVENT,
  SubmitArtworkFormEvents,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { dismissModal, navigate, switchTab } from "app/system/navigation/navigate"

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => {
      return {
        navigate: mockNavigate,
        addListener: jest.fn(),
        goBack: mockGoBack,
      }
    },
  }
})

describe("SubmitArtworkBottomNavigation", () => {
  describe("When the current step is StartFlow", () => {
    it("Shows a functional Start a New Submission button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "StartFlow" },
      })

      const startSubmissionButton = screen.getByText("Start New Submission")
      expect(startSubmissionButton).toBeOnTheScreen()

      fireEvent(startSubmissionButton, "onPress")

      expect(mockNavigate).toHaveBeenCalledWith("SelectArtist")
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

      expect(mockNavigate).toHaveBeenCalledWith("SubmitArtworkFromMyCollection")
    })
  })

  describe("When the current step is Complete your submission", () => {
    it("Shows a functional Submit Another Work button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "CompleteYourSubmission" },
      })

      const submitAnotherWork = screen.getByText("Submit Another Work")
      expect(submitAnotherWork).toBeOnTheScreen()

      fireEvent(submitAnotherWork, "onPress")
      expect(dismissModal).toHaveBeenCalled()
    })

    it("Shows a functional Submit Another Artwork button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "CompleteYourSubmission" },
      })

      const viewArtworkInMyCollection = screen.getByText("View Artwork In My Collection")
      expect(viewArtworkInMyCollection).toBeOnTheScreen()

      fireEvent(viewArtworkInMyCollection, "onPress")
      expect(switchTab).toHaveBeenCalledWith("profile")
    })
  })

  describe("When the current step is artist rejected", () => {
    it("Shows a functional Add to My Collection button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "ArtistRejected" },
      })

      const addToMyCollectionButton = screen.getByText("Add to My Collection")
      expect(addToMyCollectionButton).toBeOnTheScreen()

      fireEvent(addToMyCollectionButton, "onPress")
      expect(navigate).toHaveBeenCalledWith("/my-collection/artworks/new", {
        showInTabName: "profile",
        replaceActiveModal: true,
      })
    })

    it("Shows a functional Add Another Artist button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "ArtistRejected" },
      })

      const addAnotherArtistButton = screen.getByText("Add Another Artist")
      expect(addAnotherArtistButton).toBeOnTheScreen()

      fireEvent(addAnotherArtistButton, "onPress")

      expect(mockGoBack).toHaveBeenCalled()
    })
  })

  describe("Bottom navigation buttons", () => {
    it("Shows a functional continue button", async () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "AddTitle" },
        injectedFormikProps: { title: "Some title" },
      })

      const continueButton = screen.getByText("Continue")
      expect(continueButton).toBeOnTheScreen()

      const emit = jest.spyOn(SubmitArtworkFormEvents, "emit")
      fireEvent(continueButton, "onPress")

      expect(emit).toHaveBeenCalledWith(NAVIGATE_TO_NEXT_STEP_EVENT)
    })

    it("Shows a functional back button", () => {
      renderWithSubmitArtworkWrapper({
        component: <SubmitArtworkBottomNavigation />,
        props: { currentStep: "AddTitle" },
        injectedFormikProps: { title: "Some title" },
      })

      const backButton = screen.getByText("Back")
      expect(backButton).toBeOnTheScreen()

      const emit = jest.spyOn(SubmitArtworkFormEvents, "emit")
      fireEvent(backButton, "onPress")

      expect(emit).toHaveBeenCalledWith(NAVIGATE_TO_PREVIOUS_STEP_EVENT)
    })
  })
})
