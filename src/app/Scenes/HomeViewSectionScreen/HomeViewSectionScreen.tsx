import { ScreenOwnerType } from "@artsy/cohesion"
import { Screen, Text } from "@artsy/palette-mobile"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import {
  HomeViewSectionScreenQuery,
  HomeViewSectionScreenQuery$data,
} from "__generated__/HomeViewSectionScreenQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { HomeViewSectionScreenContent } from "app/Scenes/HomeViewSectionScreen/Components/HomeViewSectionScreenContent"
import { HomeViewSectionScreenPlaceholder } from "app/Scenes/HomeViewSectionScreen/Components/HomeViewSectionScreenPlaceholder"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface HomeSectionScreenProps {
  section: NonNullable<HomeViewSectionScreenQuery$data["homeView"]["section"]>
}

export type HomeViewSectionScreenRouteProp = RouteProp<
  {
    "/home-view/sections": {
      id: string
      sectionType?: string
      artworkIndex?: string
    }
  },
  "/home-view/sections"
>

export const HomeViewSectionScreen: React.FC<HomeSectionScreenProps> = ({ section }) => {
  const tracking = useHomeViewTracking()

  useFocusEffect(
    useCallback(() => {
      tracking.screen(section.ownerType as ScreenOwnerType)
    }, [])
  )

  return (
    <Screen>
      <HomeViewSectionScreenContent section={section} />
    </Screen>
  )
}

export const HOME_SECTION_SCREEN_QUERY = graphql`
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
  id: string
  sectionType: string
}

export const HomeViewSectionScreenQueryRenderer = withSuspense({
  Component: (props: HomeViewSectionScreenQueryRendererProps) => {
    const data = useLazyLoadQuery<HomeViewSectionScreenQuery>(HOME_SECTION_SCREEN_QUERY, {
      id: props.id,
    })

    if (!data.homeView.section) {
      return <Text>No section found</Text>
    }

    return <HomeViewSectionScreen section={data.homeView.section} />
  },
  LoadingFallback: HomeViewSectionScreenPlaceholder,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView
      showBackButton
      trackErrorBoundary={false}
      error={fallbackProps.error}
      onRetry={fallbackProps.resetErrorBoundary}
    />
  ),
})
