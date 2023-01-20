import { CollectionHubRailsOtherCollectionsRailFixture } from "app/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Text } from "palette"
import { TouchableOpacity } from "react-native"
import { CollectionGroupMemberPill, OtherCollectionsRail } from "./OtherCollectionsRail"

describe("Other Collections Rail", () => {
  const TestRenderer = () => (
    <OtherCollectionsRail
      {...({ collectionGroup: CollectionHubRailsOtherCollectionsRailFixture } as any)}
    />
  )

  it("renders a title", () => {
    const { root } = renderWithWrappersLEGACY(<TestRenderer />)
    const {
      props: { children },
    } = root.findAllByType(Text)[0]

    expect(children).toContain("Browse by Movement")
  })

  it("renders the other collection pills", () => {
    const { root } = renderWithWrappersLEGACY(<TestRenderer />)

    expect(
      root.findAllByType(CollectionGroupMemberPill).map(({ props: { children } }) => children)
    ).toEqual(["Abstract Expressionist Art", "Arte Povera", "Black Arts Movement"])
  })

  it("navigates to a new collection when a pill is tapped", () => {
    const { root } = renderWithWrappersLEGACY(<TestRenderer />)
    const [button] = root.findAllByType(TouchableOpacity)

    button.props.onPress()

    expect(navigate).toHaveBeenCalledWith("/collection/abstract-expressionism")
  })
})
