import { Box, Button, Flex, Sans, Serif, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { Alert, FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomArtworkRail } from "./Components/ViewingRoomArtworkRail"
import { ViewingRoomHeader } from "./Components/ViewingRoomHeader"

interface ViewingRoomProps {
  viewingRoom: ViewingRoom_viewingRoom
}

interface ViewingRoomPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
}

export class ViewingRoom extends React.Component<ViewingRoomProps> {
  sections(): ViewingRoomPageSection[] {
    const sections: ViewingRoomPageSection[] = []

    sections.push({
      key: "header",
      element: <ViewingRoomHeader artwork="http://placekitten.com/800/1200" title={this.props.viewingRoom.title} />,
      excludePadding: true,
    })

    sections.push({
      key: "bodyText",
      element: (
        <Serif size="3t">
          Wynn/Win is excited to present you an online exclusive viewing of Nicolas Party’s selected works. Grotto,
          alludes to three large-format pastels depicting caves. From Renaissance paintings of hermits through to
          Courbet’s The Source of the Loue and, more specifically, The Grotto of Manacor (c. 1901) by the Belgian
          painter William Degouve de Nuncques, depictions of underground caverns conjure up a wealth of historical and
          philosophical connotations.
        </Serif>
      ),
    })

    sections.push({
      key: "artworkRail",
      element: <ViewingRoomArtworkRail />,
      excludePadding: true,
    })

    sections.push({
      key: "pullQuote",
      element: (
        <Sans size="8" textAlign="center">
          His work is a reminder that appearances can be deceptive: most classical sculptures were once brightly
          coloured. Other works, such as the bust and biomorphic mass, directly echo the pastels.
        </Sans>
      ),
    })

    sections.push({
      key: "viewWorksButton",
      element: (
        <Flex width="100%">
          <Button block onPress={() => Alert.alert("nice job pressing that button")}>
            View works (5)
          </Button>
        </Flex>
      ),
    })

    return sections
  }

  render() {
    return (
      <Theme>
        <FlatList<ViewingRoomPageSection>
          data={this.sections()}
          ItemSeparatorComponent={() => <Box px={2} my={2} />}
          contentInset={{ bottom: 40 }}
          renderItem={({ item }) => (item.excludePadding ? item.element : <Box px={2}>{item.element}</Box>)}
        />
      </Theme>
    )
  }
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      title
    }
  `,
})

export const ViewingRoomRenderer: React.SFC<{ viewingRoomID: string }> = ({ viewingRoomID }) => {
  return (
    <QueryRenderer<ViewingRoomQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ViewingRoomQuery($viewingRoomID: ID!) {
          viewingRoom(id: $viewingRoomID) {
            ...ViewingRoom_viewingRoom
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        viewingRoomID: "0b7bb212-0e3a-45ba-b7f4-cd5bdb854a11",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}
