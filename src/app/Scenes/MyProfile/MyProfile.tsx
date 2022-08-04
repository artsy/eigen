import { OwnerType } from "@artsy/cohesion"
import { MyProfile_me$data } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { compact } from "lodash"
import { VisualClueDot, VisualClueText } from "palette/elements/VisualClue"
import React from "react"
import { createRefetchContainer, QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionPlaceholder, MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { MyCollectionInsightsQR } from "../MyCollection/Screens/Insights/MyCollectionInsights"
import { MyProfileHeader } from "./MyProfileHeader"

export enum Tab {
  collection = "My Collection",
  savedWorks = "Saved Works",
  insights = "Insights",
}

export const MyProfile: React.FC<{
  me: MyProfile_me$data
}> = ({ me }) => {
  // We are using unsafe_getfeatureflag here because we want to avoid breaking the rule of hooks
  // inside the StickyTabPage
  const showMyCollectionInsights = unsafe_getFeatureFlag("AREnableMyCollectionInsights")

  return (
    <StickyTabPage
      disableBackButtonUpdate
      tabs={compact([
        {
          title: Tab.collection,
          content: <MyCollectionQueryRenderer />,
          initial: true,
        },
        !!showMyCollectionInsights && {
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
          content: <FavoriteArtworksQueryRenderer />,
        },
      ])}
      staticHeaderContent={<MyProfileHeader me={me} />}
    />
  )
}

export const LOCAL_PROFILE_ICON_PATH_KEY = "LOCAL_PROFILE_ICON_PATH_KEY"

export const MyProfileFragmentContainer = createRefetchContainer(
  MyProfile,
  {
    me: graphql`
      fragment MyProfile_me on Me {
        ...MyProfileHeader_me
        ...AuctionResultsForArtistsYouCollectRail_me
      }
    `,
  },
  graphql`
    query MyProfileRefetchQuery {
      me {
        ...MyProfile_me
      }
    }
  `
)

export const MyProfileScreenQuery = graphql`
  query MyProfileQuery {
    me @optionalField {
      ...MyProfile_me
    }
  }
`

export const MyProfileQueryRenderer: React.FC = () => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.profile })}
    >
      <QueryRenderer<MyProfileQuery>
        environment={defaultEnvironment}
        query={MyProfileScreenQuery}
        render={renderWithPlaceholder({
          Container: MyProfileFragmentContainer,
          renderPlaceholder: () => <MyCollectionPlaceholder />,
        })}
        variables={{}}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
