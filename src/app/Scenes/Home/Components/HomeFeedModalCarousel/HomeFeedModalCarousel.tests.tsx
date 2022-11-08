import { fireEvent } from "@testing-library/react-native"
import { navigate, switchTab } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { FooterButtons } from "./HomeFeedModalCarouselContainer"

const mockDismissModal = jest.fn()
const mockGoToNextPage = jest.fn()

describe(FooterButtons, () => {
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
    it("the Upload Artwork button is rendered and navigates to the upload artwork screen", () => {
      const component = renderWithWrappers(
        <FooterButtons isLastStep dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const uploadArtworkButton = component.getByText("Upload Artwork")
      fireEvent(uploadArtworkButton, "onPress")
      expect(mockDismissModal).toHaveBeenCalled()
      expect(navigate).toHaveBeenCalledWith("/my-collection/artworks/new")
    })

    it("the Go button is rendered and navigates to the upload artwork screen", () => {
      const component = renderWithWrappers(
        <FooterButtons isLastStep dismissModal={mockDismissModal} goToNextPage={mockGoToNextPage} />
      )

      const goToMyCollectionButton = component.getByText("Go to My Collection")
      fireEvent(goToMyCollectionButton, "onPress")
      expect(mockDismissModal).toHaveBeenCalled()
      expect(switchTab).toHaveBeenCalledWith("profile")
    })
  })
})
