import { Flex, Screen, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { NewWorksForYouSection } from "app/Scenes/HomeView/Sections/NewWorksForYouSection"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const SCREEN_TITLE = "HomeView WIP"

export const HomeView: React.FC = () => {
  const queryData = useLazyLoadQuery<HomeViewQuery>(homeViewScreenQuery, {})
  const sections = extractNodes(queryData.homeView.sectionsConnection)

  return (
    <Screen mt={0}>
      <Screen.AnimatedHeader onBack={goBack} title={SCREEN_TITLE} />

      <Screen.StickySubHeader
        title={SCREEN_TITLE}
        separatorComponent={<Separator borderColor="black5" />}
      />

      <Screen.Body fullwidth>
        <Screen.FlatList
          data={sections}
          keyExtractor={(item) => `${item.title}`}
          renderItem={({ item }) => {
            return <Section section={item} />
          }}
          ItemSeparatorComponent={() => <Spacer y={2} />}
        />
      </Screen.Body>
    </Screen>
  )
}

const Section: React.FC<{ section: any }> = (props) => {
  const { section } = props

  if (props.section.key === "NEW_WORKS_FOR_YOU") {
    return <NewWorksForYouSection section={section} />
  }

  return (
    <Flex bg="black5" alignItems="center">
      <Text color="black60" p={2}>
        Need to render the{" "}
        <Text color="black100" fontSize="80%">
          {section.key}
        </Text>{" "}
        section as a{" "}
        <Text color="blue100" fontSize="80%">
          {section.component.type}
        </Text>{" "}
        component, titled{" "}
        <Text color="black100" fontWeight="bold">
          {section.title}
        </Text>{" "}
      </Text>
    </Flex>
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
            ... on GenericHomeViewSection {
              key
              title
              component {
                type
              }
            }

            ...NewWorksForYouSection_section
          }
        }
      }
    }
  }
`
