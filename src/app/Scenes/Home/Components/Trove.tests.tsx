import { TroveTestsQuery } from "__generated__/TroveTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { TroveFragmentContainer } from "./Trove"

jest.unmock("react-relay")

describe("Trove", () => {
  let environment = createMockEnvironment()

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<TroveTestsQuery>
      query={graphql`
        query TroveTestsQuery {
          homePage {
            ...Trove_trove
          }
        }
      `}
      render={({ props }) =>
        props?.homePage ? <TroveFragmentContainer trove={props.homePage} /> : null
      }
      variables={{}}
      environment={environment}
    />
  )

  it("renders the trove", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Trove",
            subtitle: "Browse available artworks by emerging artists.",
            creditLine: "",
          }
        },
      })
    )

    expect(tree.root.findAllByType(OpaqueImageView)).toHaveLength(1)
    expect(extractText(tree.root)).toMatchInlineSnapshot(
      `"TroveBrowse available artworks by emerging artists."`
    )
  })

  it("is tappable", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Trove",
            href: "/gene/trove",
          }
        },
      })
    )

    expect(navigate).not.toHaveBeenCalled()
    tree.root.findByType(Touchable).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/gene/trove")
  })
})
