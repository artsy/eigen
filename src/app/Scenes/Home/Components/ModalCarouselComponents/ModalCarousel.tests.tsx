import { fireEvent } from "@testing-library/react-native"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate, switchTab } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"
import { FooterButtons } from "./ModalCarouselContainer"

const mockDismissModal = jest.fn()
const mockGoToNextPage = jest.fn()

describe(FooterButtons, () => {
  const trackEvent = useTracking().trackEvent

  describe("when the active step is not the last one", () => {
    it("the next button is rendered and navigates to the next page", () => {
      const component = renderWithWrappers(
        <FooterButtons dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const nextButton = component.getByText("Next")
      fireEvent(nextButton, "onPress")
      expect(mockGoToNextPage).toHaveBeenCalled()
    })
  })

  describe("when the active step is the last one", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableMyCollectionCollectedArtists: false,
        ARShowCollectedArtistOnboarding: true,
      })
    })

    it("the Upload Artwork button is rendered and navigates to the upload artwork screen", async () => {
      const component = renderWithWrappers(
        <FooterButtons isLastStep dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const uploadArtworkButton = component.getByText("Upload Artwork")
      fireEvent(uploadArtworkButton, "onPress")
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

    it("the Go button is rendered and navigates to the upload artwork screen", () => {
      const component = renderWithWrappers(
        <FooterButtons isLastStep dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const goToMyCollectionButton = component.getByText("Go to My Collection")
      fireEvent(goToMyCollectionButton, "onPress")
      expect(mockDismissModal).toHaveBeenCalled()
      expect(switchTab).toHaveBeenCalledWith("profile")
      expect(trackEvent).toHaveBeenCalledWith({
        action: "visitMyCollection",
        context_screen_owner_type: "myCollectionOnboarding",
        context_module: "myCollectionOnboarding",
      })
    })
  })
})
