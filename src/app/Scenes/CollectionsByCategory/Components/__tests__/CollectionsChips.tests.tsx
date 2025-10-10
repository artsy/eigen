import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionsChips } from "app/Scenes/CollectionsByCategory/Components/CollectionsChips"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"

describe("CollectionsChips", () => {
  const trackEvent = useTracking().trackEvent

  const mockChips = [
    { title: "Contemporary", slug: "contemporary", href: "/collection/contemporary" },
    { title: "Modern", slug: "modern", href: "/collection/modern" },
    { title: "Street Art", slug: "street-art", href: "/collection/street-art" },
  ]

  it("renders", () => {
    renderWithWrappers(<CollectionsChips chips={mockChips} />)

    expect(screen.getByText("Contemporary")).toBeOnTheScreen()
    expect(screen.getByText("Modern")).toBeOnTheScreen()
    expect(screen.getByText("Street Art")).toBeOnTheScreen()
  })

  it("when tapping on a chip", () => {
    renderWithWrappers(<CollectionsChips chips={mockChips} />)

    fireEvent.press(screen.getByText("Contemporary"))

    expect(navigate).toHaveBeenCalledWith("/collection/contemporary")
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedCollectionGroup",
      context_module: "collectionRail",
      context_screen_owner_type: "collectionsCategory",
      destination_screen_owner_slug: "contemporary",
      destination_screen_owner_type: "collection",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })
})
