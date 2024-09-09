import { Screen, Text } from "@artsy/palette-mobile"
import {
  HomeViewSectionScreenQuery,
  HomeViewSectionScreenQuery$data,
} from "__generated__/HomeViewSectionScreenQuery.graphql"
import { HomeViewSectionScreenContent } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenContent"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface HomeSectionScreenProps {
  section: NonNullable<HomeViewSectionScreenQuery$data["homeView"]["section"]>
}

export const HomeSectionScreenWrapper: React.FC<HomeSectionScreenProps> = ({ section }) => {
  const title =
    section?.__typename === "ArtworksRailHomeViewSection" ? section.component?.title : ""

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title={title || ""} />

      <Screen.Body fullwidth>
        <HomeViewSectionScreenContent section={section} />
      </Screen.Body>
    </Screen>
  )
}

const HOME_SECTION_SCREEN_QUERY = graphql`
  query HomeViewSectionScreenQuery($id: String!) {
    homeView {
      section(id: $id) {
        __typename
        ... on ArtworksRailHomeViewSection {
          internalID
          component {
            title
          }
        }
      }
    }
  }
`

interface HomeViewSectionScreenQueryRendererProps {
  sectionID: string
}

export const HomeViewSectionScreenQueryRenderer = withSuspense(
  (props: HomeViewSectionScreenQueryRendererProps) => {
    const data = useLazyLoadQuery<HomeViewSectionScreenQuery>(
      HOME_SECTION_SCREEN_QUERY,
      {
        id: props.sectionID,
      },
      {
        // Since we already fetched the __typename in home, we don't need to refetch it again
        // This is fine here because we are not querying for the data of the section itself
        // In case this screen is opened using a deep link, we will fetch it
        fetchPolicy: "store-or-network",
      }
    )

    if (!data.homeView.section) {
      return <Text>No section found</Text>
    }

    return <HomeSectionScreenWrapper section={data.homeView.section} />
  }
)
