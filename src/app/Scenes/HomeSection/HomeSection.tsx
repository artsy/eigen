import { Flex, Screen, Text } from "@artsy/palette-mobile"
import {
  HomeSectionScreenQuery,
  HomeSectionScreenQuery$data,
} from "__generated__/HomeSectionScreenQuery.graphql"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface HomeSectionScreenProps {
  section: HomeSectionScreenQuery$data["homeView"]["section"]
}

export const HomeSectionScreen: React.FC<HomeSectionScreenProps> = ({ section }) => {
  const title =
    section?.__typename === "ArtworksRailHomeViewSection" ? section.component?.title : ""

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title={title} />

      <Screen.Body fullwidth>
        <Screen.ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text variant="lg-display">{title}</Text>
          <Flex backgroundColor="red10" height={1000} p={2}></Flex>
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

const HOME_SECTION_SCREEN_QUERY = graphql`
  query HomeSectionScreenQuery($id: String!) {
    homeView {
      section(id: $id) {
        __typename
        ... on ArtworksRailHomeViewSection {
          component {
            title
          }
        }
      }
    }
  }
`

interface HomeSectionScreenQueryRendererProps {
  sectionId: string
}

export const HomeSectionScreenQueryRenderer = withSuspense(
  (props: HomeSectionScreenQueryRendererProps) => {
    const data = useLazyLoadQuery<HomeSectionScreenQuery>(HOME_SECTION_SCREEN_QUERY, {
      id: props.sectionId,
    })

    if (!data.homeView.section) {
      return <Text>No section found</Text>
    }

    return <HomeSectionScreen section={data.homeView.section} />
  }
)
