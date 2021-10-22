import { RecentlyViewedWorksRail_homePage } from "__generated__/RecentlyViewedWorksRail_homePage.graphql"
import { RecentlyViewedWorksRailQuery } from "__generated__/RecentlyViewedWorksRailQuery.graphql"
import { SmallTileRailPlaceholder } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArtworkRailFragmentContainer } from "./ArtworkRail"
import { RailScrollProps } from "./types"

interface RecentlyViewedWorksRailProps {
  homePage: RecentlyViewedWorksRail_homePage
}

const RecentlyViewedWorksRail: React.FC<RecentlyViewedWorksRailProps & RailScrollProps> = ({ homePage, scrollRef }) => {
  const module = homePage?.artworkModules?.[0]

  if (!module) {
    return null
  }

  return <ArtworkRailFragmentContainer rail={module} scrollRef={scrollRef} />
}

const RecentlyViewedWorksRailQueryDefinition = graphql`
  query RecentlyViewedWorksRailQuery {
    homePage {
      ...RecentlyViewedWorksRail_homePage
    }
  }
`

export const RecentlyViewedWorksRailContainer = createFragmentContainer(RecentlyViewedWorksRail, {
  homePage: graphql`
    fragment RecentlyViewedWorksRail_homePage on HomePage {
      artworkModules(maxRails: -1, maxFollowedGeneRails: -1, include: [RECENTLY_VIEWED_WORKS]) {
        ...ArtworkRail_rail
      }
    }
  `,
})

export const RecentlyViewedWorksRailQueryRenderer: React.FC<{ environment: RelayModernEnvironment }> = ({
  environment,
}) => {
  return (
    <QueryRenderer<RecentlyViewedWorksRailQuery>
      environment={environment}
      /* tslint:disable relay-operation-generics */
      query={RecentlyViewedWorksRailQueryDefinition}
      variables={{ count: 10 }}
      render={renderWithPlaceholder({
        Container: RecentlyViewedWorksRailContainer,
        renderPlaceholder: () => <SmallTileRailPlaceholder />,
        renderFallback: () => null,
      })}
    />
  )
}
