import { Box, Separator, Theme } from "@artsy/palette"
import { CityFairList_city } from "__generated__/CityFairList_city.graphql"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { RelayProp } from "react-relay"
import { TabFairItemRow } from "./Components/TabFairItemRow"

interface Props {
  city: CityFairList_city
}

interface State {
  relay: RelayProp
}

class CityFairList extends React.Component<Props, State> {
  renderItem = item => {
    return <TabFairItemRow item={item} />
  }

  render() {
    const {
      city: {
        fairs: { edges },
      },
    } = this.props
    return (
      <Theme>
        <Box px={2}>
          <FlatList
            data={edges}
            ItemSeparatorComponent={() => <Separator />}
            keyExtractor={item => item.node.id}
            renderItem={({ item }) => this.renderItem(item)}
            scrollEnabled={false}
          />
        </Box>
      </Theme>
    )
  }
}

export default createFragmentContainer(
  CityFairList,
  graphql`
    fragment CityFairList_city on City {
      fairs(first: 100) {
        edges {
          node {
            id
            name
            exhibition_period
            counts {
              partners
            }

            location {
              coordinates {
                lat
                lng
              }
            }

            image {
              image_url
              aspect_ratio
              url
            }

            profile {
              icon {
                id
                href
                height
                width
                url(version: "square140")
              }
              __id
              id
              name
            }

            start_at
            end_at
          }
        }
      }
    }
  `
)
