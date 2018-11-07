import { Sans } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import { InvertedWhiteBorderedButton } from "lib/Components/Buttons"
import { Fonts } from "lib/data/fonts"
import { get } from "lodash"
import React from "react"
import { Image, Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { NearbyShows as _nearbyShows } from "./nearbyShows"

interface Props {
  shows: Shows_show
}
interface State {
  savedShows: any[]
}
export class Shows extends React.Component<Props, State> {
  state = {
    savedShows: [],
  }
  saveShow(showId) {
    const savedShows = this.state.savedShows
    savedShows.push(showId)
    this.setState({
      savedShows,
    })
  }
  render() {
    const { city, nearbyShows } = this.props.shows

    const showDetails = _nearbyShows.edges.filter(show => show.node)
    return (
      <>
        <Sans size="8">{"Current Shows In " + city}</Sans>
        {showDetails.map((showDetail, el) => (
          <View key={el}>
            <View style={{ marginBottom: 15, marginTop: 15 }}>
              <Image source={{ uri: get(showDetail, "node.images[0].url") }} style={{ width: "100%", height: 200 }} />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                overflow: "hidden",
              }}
            >
              <View style={{ width: "70%" }}>
                {get(showDetail, "node.name") ? <Text>{get(showDetail, "node.name")}</Text> : null}
                {get(showDetail, "node.partner.name") ? <Text>{get(showDetail, "node.partner.name")}</Text> : null}
                {get(showDetail, "node.location.address") ? (
                  <Text>{get(showDetail, "node.location.address")}</Text>
                ) : null}
                {get(showDetail, "node.location.address_2") ? (
                  <Text>{get(showDetail, "node.location.address_2")}</Text>
                ) : null}
                {get(showDetail, "node.partner.state") ? <Text>{get(showDetail, "node.partner.state")}</Text> : null}
                {get(showDetail, "node.partner.postal_code") ? (
                  <Text>{get(showDetail, "node.partner.postal_code")}</Text>
                ) : null}
              </View>
              <View>
                <InvertedWhiteBorderedButton
                  text="Save"
                  onPress={() => {
                    this.saveShow(showDetail.node.id)
                  }}
                  style={{
                    width: 100,
                    borderRadius: 2,
                    borderColor: "black",
                  }}
                  textStyle={{
                    color: "white",
                    fontFamily: Fonts.Unica77LLMedium,
                    fontSize: 14,
                    textShadowColor: "black",
                  }}
                  key="1"
                />
              </View>
            </View>
          </View>
        ))}
      </>
    )
  }
}

export const LocationContainer = createFragmentContainer(
  Shows,
  graphql`
    fragment Shows_show on Show {
      city
      nearbyShows {
        edges {
          node {
            id
            name
            images {
              url
              aspect_ratio
            }
            partner {
              ... on ExternalPartner {
                name
              }
              ... on Partner {
                name
              }
            }
            location {
              address
              address_2
              state
              postal_code
            }
          }
        }
      }
    }
  `
)
