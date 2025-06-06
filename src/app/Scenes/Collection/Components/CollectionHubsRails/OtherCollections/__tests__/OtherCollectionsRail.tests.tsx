import { fireEvent, screen } from "@testing-library/react-native"
import { OtherCollectionsRail } from "app/Scenes/Collection/Components/CollectionHubsRails/OtherCollections/OtherCollectionsRail"
import { CollectionHubRailsOtherCollectionsRailFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Other Collections Rail", () => {
  const TestRenderer = () => (
    <OtherCollectionsRail
      {...({ collectionGroup: CollectionHubRailsOtherCollectionsRailFixture } as any)}
    />
  )

  it("renders a title", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Browse by Movement")).toBeOnTheScreen()
  })

  it("renders the other collection pills", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Browse by Movement")).toBeOnTheScreen()
    expect(screen.getByText("Abstract Expressionist Art")).toBeOnTheScreen()
    expect(screen.getByText("Arte Povera")).toBeOnTheScreen()
    expect(screen.getByText("Black Arts Movement")).toBeOnTheScreen()
  })

  it("navigates to a new collection when a pill is tapped", () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent.press(screen.getByText("Abstract Expressionist Art"))

    expect(navigate).toHaveBeenCalledWith("/collection/abstract-expressionism")
  })
})
