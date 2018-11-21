import { Serif } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowItem } from "./Components/ShowItem"

interface Props {
  show: Shows_show
}
export class Shows extends React.Component<Props> {
  render() {
    const { edges } = this.props.show.nearbyShows

    return (
      <>
        <Serif size="5">More Shows</Serif>
        <FlatList
          horizontal
          data={edges}
          keyExtractor={item => item.node.id}
          renderItem={({ item }) => {
            return <ShowItem show={item.node as any} />
          }}
        />
      </>
    )
  }
}

export const ShowsContainer = createFragmentContainer(
  Shows,
  graphql`
    fragment Shows_show on Show {
      nearbyShows(first: 20) {
        edges {
          node {
            ...ShowItem_show
          }
        }
      }
    }
  `
)
