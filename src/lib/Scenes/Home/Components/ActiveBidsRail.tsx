import { ActiveBidsRail_homePage } from "__generated__/ActiveBidsRail_homePage.graphql"
import { ActiveBidsRailQuery } from "__generated__/ActiveBidsRailQuery.graphql"
import { SmallTileRailPlaceholder } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArtworkRailFragmentContainer } from "./ArtworkRail"
import { RailScrollProps } from "./types"

interface ActiveBidsRailProps {
  homePage: ActiveBidsRail_homePage
}

const ActiveBidsRail: React.FC<ActiveBidsRailProps & RailScrollProps> = ({ homePage, scrollRef }) => {
  const module = homePage?.artworkModules?.[0]

  if (!module) {
    return null
  }

  return <ArtworkRailFragmentContainer rail={module} scrollRef={scrollRef} />
}

const ActiveBidsRailQueryDefinition = graphql`
  query ActiveBidsRailQuery {
    homePage {
      ...ActiveBidsRail_homePage
    }
  }
`

export const ActiveBidsRailContainer = createFragmentContainer(ActiveBidsRail, {
  homePage: graphql`
    fragment ActiveBidsRail_homePage on HomePage {
      artworkModules(maxRails: -1, maxFollowedGeneRails: -1, include: [ACTIVE_BIDS]) {
        ...ArtworkRail_rail
      }
    }
  `,
})

export const ActiveBidsRailQueryRenderer: React.FC<{ environment: RelayModernEnvironment }> = ({ environment }) => {
  return (
    <QueryRenderer<ActiveBidsRailQuery>
      environment={environment}
      /* tslint:disable relay-operation-generics */
      query={ActiveBidsRailQueryDefinition}
      variables={{ count: 10 }}
      render={renderWithPlaceholder({
        Container: ActiveBidsRailContainer,
        renderPlaceholder: () => <SmallTileRailPlaceholder />,
        renderFallback: () => null,
      })}
    />
  )
}
