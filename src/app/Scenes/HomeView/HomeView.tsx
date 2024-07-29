import { Flex, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const HomeView: React.FC = () => {
  const queryData = useLazyLoadQuery<HomeViewQuery>(homeViewScreenQuery, {})
  const sections = extractNodes(queryData.homeView.sectionsConnection)

  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.FlatList
          data={sections}
          keyExtractor={(item) => `${item.internalID || ""}`}
          renderItem={({ item }) => {
            return <Section section={item} />
          }}
          ItemSeparatorComponent={() => <Spacer y={2} />}
        />
      </Screen.Body>
    </Screen>
  )
}

export const HomeViewScreen: React.FC = () => (
  <Suspense
    fallback={
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Loading home view…</Text>
      </Flex>
    }
  >
    <HomeView />
  </Suspense>
)

export const homeViewScreenQuery = graphql`
  query HomeViewQuery {
    homeView {
      sectionsConnection(first: 4) {
        edges {
          cursor
          node {
            __typename
            ... on GenericHomeViewSection {
              internalID
              ...GenericHomeViewSection_section
            }
            ... on ArtworksRailHomeViewSection {
              internalID
              ...ArtworksRailHomeViewSection_section
            }

            ...NewWorksForYouSection_section
          }
        }
      }
    }
  }
`
