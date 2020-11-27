import { HomeHeroTestsQuery } from "__generated__/HomeHeroTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { HomeHeroContainer } from "../HomeHero"

jest.mock("react-tracking")

jest.unmock("react-relay")
describe("HomeHero", () => {
  let environment = createMockEnvironment()
  const trackEvent = jest.fn()

  beforeEach(() => {
    environment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockReturnValue({
      trackEvent,
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
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
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Art Keeps Going",
            subtitle: "Art in the time of pandemic",
            linkText: "Learn More",
            creditLine: "Andy Warhol, 1973",
          }
        },
      })
    )

    expect(tree.root.findAllByType(Image)).toHaveLength(1)
    expect(extractText(tree.root)).toMatchInlineSnapshot(`"Art Keeps GoingArt in the time of pandemicLearn More"`)
  })

  it(`only shows the credit line after the image has loaded`, () => {
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Art Keeps Going",
            subtitle: "Art in the time of pandemic",
            linkText: "Learn More",
            creditLine: "Andy Warhol, 1973",
          }
        },
      })
    )

    expect(extractText(tree.root)).not.toContain("Warhol")
    tree.root.findByType(Image).props.onLoad()
    expect(extractText(tree.root)).toContain("Warhol")
  })

  it("is tappable", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "My Special Title",
            href: "/my-special-href",
          }
        },
      })
    )

    expect(navigate).not.toHaveBeenCalled()
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-special-href")
    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "My Special Title",
        destination_path: "/my-special-href",
      })
    )
  })
})
