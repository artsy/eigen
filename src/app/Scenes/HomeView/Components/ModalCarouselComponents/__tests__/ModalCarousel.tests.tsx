import { fireEvent, screen } from "@testing-library/react-native"
import { FooterButtons } from "app/Scenes/HomeView/Components/ModalCarouselComponents/ModalCarouselContainer"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { navigate, switchTab } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"

const mockDismissModal = jest.fn()
const mockGoToNextPage = jest.fn()

describe(FooterButtons, () => {
  const trackEvent = useTracking().trackEvent

  describe("when the active step is not the last one", () => {
    it("the next button is rendered and navigates to the next page", () => {
      renderWithWrappers(
        <FooterButtons dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const nextButton = screen.getByText("Next")
      fireEvent(nextButton, "onPress")
      expect(mockGoToNextPage).toHaveBeenCalled()
    })
  })

  describe("when the active step is the last one", () => {
    it("the Add Artwork button is rendered and navigates to the add artwork screen", async () => {
      renderWithWrappers(
        <FooterButtons isLastStep dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const appArtworkButton = screen.getByText("Add Artwork")
      fireEvent(appArtworkButton, "onPress")
      expect(switchTab).toHaveBeenCalledWith("profile")
      expect(mockDismissModal).toHaveBeenCalled()
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("my-collection/artworks/new", {
        passProps: {
          source: Tab.collection,
        },
      })
      expect(trackEvent).toHaveBeenCalledWith({
        action: "addCollectedArtwork",
        context_module: "myCollectionOnboarding",
        context_owner_type: "myCollectionOnboarding",
        platform: "mobile",
      })
    })

    it("the Add Artist button is rendered and navigates to the add artist screen", async () => {
      renderWithWrappers(
        <FooterButtons isLastStep dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const addArtistButton = screen.getByText("Add Artists")
      fireEvent(addArtistButton, "onPress")
      expect(switchTab).toHaveBeenCalledWith("profile")
      expect(mockDismissModal).toHaveBeenCalled()
      await flushPromiseQueue()

      expect(navigate).toHaveBeenCalledWith("my-collection/collected-artists/new", {
        passProps: {
          source: Tab.collection,
        },
      })

      expect(trackEvent).toHaveBeenCalledWith({
        action: "addNewArtistName",
        context_module: "myCollectionOnboarding",
        context_owner_type: "myCollectionOnboarding",
        platform: "mobile",
      })
    })
  })
})
