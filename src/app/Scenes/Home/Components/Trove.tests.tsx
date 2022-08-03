import { TroveTestsQuery } from "__generated__/TroveTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { Touchable } from "palette"
import { graphql, QueryRenderer } from "react-relay"

import { TroveFragmentContainer } from "./Trove"

describe("Trove", () => {
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
      environment={getRelayEnvironment()}
    />
  )

  it("renders the trove", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      HomePageHeroUnit() {
        return {
          title: "Trove",
          subtitle: "Browse available artworks by emerging artists.",
          creditLine: "",
        }
      },
    })

    expect(tree.root.findAllByType(OpaqueImageView)).toHaveLength(1)
    expect(extractText(tree.root)).toMatchInlineSnapshot(
      `"TroveBrowse available artworks by emerging artists."`
    )
  })

  it("is tappable", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      HomePageHeroUnit() {
        return {
          title: "Trove",
          href: "/gene/trove",
        }
      },
    })

    expect(navigate).not.toHaveBeenCalled()
    tree.root.findByType(Touchable).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/gene/trove")
  })
})
