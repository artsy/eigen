import { Sans, Theme } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { CollectionHubRailsOtherCollectionsRailFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import React from "react"
import { TouchableOpacity } from "react-native"
import ReactTestRenderer from "react-test-renderer"
import { CollectionGroupMemberPill, OtherCollectionsRail } from "../OtherCollectionsRail"

jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentNavigationViewController: jest.fn() }))

describe("Other Collections Rail", () => {
  const TestRenderer = () => (
    <Theme>
      <OtherCollectionsRail {...({ collectionGroup: CollectionHubRailsOtherCollectionsRailFixture } as any)} />
    </Theme>
  )

  it("renders a title", () => {
    const { root } = ReactTestRenderer.create(<TestRenderer />)
    const {
      props: { children },
    } = root.findByType(Sans)

    expect(children).toContain("Browse by Movement")
  })

  it("renders the other collection pills", () => {
    const { root } = ReactTestRenderer.create(<TestRenderer />)

    expect(root.findAllByType(CollectionGroupMemberPill).map(({ props: { children } }) => children)).toEqual([
      "Abstract Expressionist Art",
      "Arte Povera",
      "Black Arts Movement",
    ])
  })

  it("navigates to a new collection when a pill is tapped", () => {
    const { root } = ReactTestRenderer.create(<TestRenderer />)
    const [button] = root.findAllByType(TouchableOpacity)

    button.props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/abstract-expressionism"
    )
  })
})
