import { ScreenOwnerType } from "@artsy/cohesion"
import { Screen, Text } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import {
  HomeViewSectionScreenQuery,
  HomeViewSectionScreenQuery$data,
} from "__generated__/HomeViewSectionScreenQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { HomeViewSectionScreenContent } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenContent"
import { HomeViewSectionScreenPlaceholder } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenPlaceholder"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface HomeSectionScreenProps {
  section: NonNullable<HomeViewSectionScreenQuery$data["homeView"]["section"]>
}

export const HomeViewSectionScreen: React.FC<HomeSectionScreenProps> = ({ section }) => {
  const tracking = useHomeViewTracking()
  const title =
    section?.__typename === "ArtworksRailHomeViewSection" ? section.component?.title : ""

  useFocusEffect(
    useCallback(() => {
      tracking.screen(section.ownerType as ScreenOwnerType)
    }, [])
  )

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
        internalID

        component {
          title
        }
        ownerType

        ... on HomeViewSectionArtworks {
          ...HomeViewSectionScreenArtworks_section
        }
      }
    }
  }
`

interface HomeViewSectionScreenQueryRendererProps {
  sectionID: string
  sectionType: string
}

export const HomeViewSectionScreenQueryRenderer = withSuspense(
  (props: HomeViewSectionScreenQueryRendererProps) => {
    const data = useLazyLoadQuery<HomeViewSectionScreenQuery>(HOME_SECTION_SCREEN_QUERY, {
      id: props.sectionID,
    })

    if (!data.homeView.section) {
      return <Text>No section found</Text>
    }

    return <HomeViewSectionScreen section={data.homeView.section} />
  },
  HomeViewSectionScreenPlaceholder,
  (fallbackProps) => (
    <LoadFailureView showBackButton trackErrorBoundary={false} error={fallbackProps.error} />
  )
)
