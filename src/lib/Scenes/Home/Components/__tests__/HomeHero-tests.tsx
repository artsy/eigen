import { HomeHeroTestsQuery } from "__generated__/HomeHeroTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { create } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { HomeHeroContainer } from "../HomeHero"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")
describe("HomeHero", () => {
  let environment = createMockEnvironment()
  beforeEach(() => {
    environment = createMockEnvironment()
  })
  const TestRenderer = () => (
    <QueryRenderer<HomeHeroTestsQuery>
      query={graphql`
        query HomeHeroTestsQuery {
          homePage {
            ...HomeHero_homePage
          }
        }
      `}
      render={({ props }) => (props?.homePage ? <HomeHeroContainer homePage={props.homePage} /> : null)}
      variables={{}}
      environment={environment}
    />
  )
  it(`renders all the things`, () => {
    const tree = create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Art Keeps Going",
            linkText: "Learn More",
          }
        },
      })
    )

    expect(tree.root.findAllByType(OpaqueImageView)).toHaveLength(1)
    expect(extractText(tree.root)).toMatchInlineSnapshot(`"Art Keeps GoingLearn More"`)
  })

  it("is tappable", () => {
    const tree = create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            href: "/my-special-href",
          }
        },
      })
    )

    expect(SwitchBoard.presentNavigationViewController).not.toHaveBeenCalled()
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/my-special-href")
  })
})
