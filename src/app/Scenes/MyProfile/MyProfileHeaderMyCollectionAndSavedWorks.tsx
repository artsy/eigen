import { OwnerType } from "@artsy/cohesion"
import { VisualClueDot, VisualClueText } from "@artsy/palette-mobile"
import { MyProfileHeaderMyCollectionAndSavedWorksQuery } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorksQuery.graphql"
import { MyProfileHeaderMyCollectionAndSavedWorks_me$data } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorks_me.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtworkLists } from "app/Scenes/ArtworkLists/ArtworkLists"
import { FavoriteArtworksQueryRenderer } from "app/Scenes/Favorites/FavoriteArtworks"
import {
  MyCollectionPlaceholder,
  MyCollectionQueryRenderer,
} from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { compact } from "lodash"
import { createRefetchContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { MyProfileHeader } from "./MyProfileHeader"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saves",
  insights = "Insights",
}

export const MyProfileHeaderMyCollectionAndSavedWorks: React.FC<{
  me: MyProfileHeaderMyCollectionAndSavedWorks_me$data
}> = ({ me }) => {
  const isArtworkListsEnabled = useFeatureFlag("AREnableArtworkLists")
  return (
    <StickyTabPage
      disableBackButtonUpdate
      tabs={compact([
        {
          title: Tab.collection,
          content: <MyCollectionQueryRenderer />,
          initial: true,
        },
        {
          title: Tab.insights,
          content: <MyCollectionInsightsQR />,
          visualClues: [
            {
              jsx: (
                <VisualClueDot style={{ marginLeft: 5, alignSelf: "flex-start", marginTop: 1 }} />
              ),
              visualClueName: "AddedArtworkWithInsightsVisualClueDot",
            },
            {
              jsx: <VisualClueText />,
              visualClueName: "MyCollectionInsights",
            },
          ],
        },
        {
          title: Tab.savedWorks,
          content: isArtworkListsEnabled ? <ArtworkLists /> : <FavoriteArtworksQueryRenderer />,
        },
      ])}
      staticHeaderContent={<MyProfileHeader me={me} />}
    />
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfileHeaderMyCollectionAndSavedWorksFragmentContainer = createRefetchContainer(
  MyProfileHeaderMyCollectionAndSavedWorks,
  {
    me: graphql`
      fragment MyProfileHeaderMyCollectionAndSavedWorks_me on Me {
        ...MyProfileHeader_me
        ...AuctionResultsForArtistsYouCollectRail_me
      }
    `,
  },
  graphql`
    query MyProfileHeaderMyCollectionAndSavedWorksRefetchQuery {
      me {
        ...MyProfileHeaderMyCollectionAndSavedWorks_me
      }
    }
  `
)

export const MyProfileHeaderMyCollectionAndSavedWorksScreenQuery = graphql`
  query MyProfileHeaderMyCollectionAndSavedWorksQuery {
    me @optionalField {
      ...MyProfileHeaderMyCollectionAndSavedWorks_me
    }
  }
`

export const MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <QueryRenderer<MyProfileHeaderMyCollectionAndSavedWorksQuery>
        environment={defaultEnvironment}
        query={MyProfileHeaderMyCollectionAndSavedWorksScreenQuery}
        render={renderWithPlaceholder({
          Container: MyProfileHeaderMyCollectionAndSavedWorksFragmentContainer,
          renderPlaceholder: () => <MyCollectionPlaceholder />,
        })}
        variables={{}}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
