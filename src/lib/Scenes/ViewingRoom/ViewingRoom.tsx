import { Box, Button, Flex, Sans, Serif, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { Alert, FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomArtworkRail } from "./Components/ViewingRoomArtworkRail"
import { ViewingRoomArtworksContainer } from "./Components/ViewingRoomArtworks"
import { ViewingRoomHeader } from "./Components/ViewingRoomHeader"
import { ViewingRoomSubsectionsContainer } from "./Components/ViewingRoomSubsections"

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
      element: <ViewingRoomHeader artwork={this.props.viewingRoom.heroImageURL} title={this.props.viewingRoom.title} />,
      excludePadding: true,
    })

    sections.push({
      key: "introStatement",
      element: <Serif size="3t">{this.props.viewingRoom.introStatement}</Serif>,
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
          {this.props.viewingRoom.pullQuote}
        </Sans>
      ),
    })

    sections.push({
      key: "body",
      element: <Serif size="3t">{this.props.viewingRoom.body}</Serif>,
    })

    sections.push({
      key: "subsections",
      element: <ViewingRoomSubsectionsContainer viewingRoom={this.props.viewingRoom} />,
      excludePadding: false,
    })

    sections.push({
      key: "artworks",
      element: <ViewingRoomArtworksContainer viewingRoom={this.props.viewingRoom} />,
      excludePadding: false,
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
      body
      pullQuote
      introStatement
      startAt
      endAt
      heroImageURL
      ...ViewingRoomArtworks_viewingRoom
      ...ViewingRoomSubsections_viewingRoom
    }
  `,
})

// We'll eventually have this take in { viewingRoomID } as props and delete the hardcoded ID
export const ViewingRoomRenderer: React.SFC<{ viewingRoomID: string }> = () => {
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
