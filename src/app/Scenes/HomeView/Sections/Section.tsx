import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionsConnection_viewer$data } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { ArtistsRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArtistsRailHomeViewSection"
import { ArtworksRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArtworksRailHomeViewSection"
import { GenericHomeViewSection } from "app/Scenes/HomeView/Sections/GenericHomeViewSection"
import { ExtractNodeType } from "app/utils/relayHelpers"

type SectionsConnection = NonNullable<
  HomeViewSectionsConnection_viewer$data["homeView"]["sectionsConnection"]
>

type SectionT = ExtractNodeType<SectionsConnection>

export const Section: React.FC<{ section: SectionT }> = (props) => {
  const { section } = props

  switch (section.__typename) {
    case "ArtworksRailHomeViewSection":
      return <ArtworksRailHomeViewSection section={section} />
    case "GenericHomeViewSection":
      return <GenericHomeViewSection section={section} />
    case "ArtistsRailHomeViewSection":
      return <ArtistsRailHomeViewSection section={section} />
    default:
      if (__DEV__) {
        return (
          <Flex p={2} backgroundColor="black10">
            <Text>Non supported section:</Text>
            <Text color="devpurple">{section.__typename}</Text>
          </Flex>
        )
      }
      return null
  }
}
