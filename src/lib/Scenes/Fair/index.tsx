import { Theme } from "@artsy/palette"
import { Fair_fair } from "__generated__/Fair_fair.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { LocationMapContainer as LocationMap } from "lib/Components/LocationMap"
import { FairHeaderContainer as FairHeader } from "./Components/FairHeader"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    const sections = []

    sections.push({
      type: "location",
      data: {
        location: fair.location,
        partnerName: fair.organizer.profile.name,
      },
    })

    this.setState({ sections })
  }

  render() {
    const { fair } = this.props

    return (
      <Theme>
        <FlatList
          keyExtractor={(item, index) => item.type + String(index)}
          data={this.state.sections}
          ListHeaderComponent={<FairHeader fair={fair} />}
          renderItem={({ item: { data, type } }) => {
            switch (type) {
              case "location":
                return <LocationMap {...data} />
              default:
                return null
            }
          }}
        />
      </Theme>
    )
  }
}

export default createFragmentContainer(
  Fair,
  graphql`
    fragment Fair_fair on Fair {
      ...FairHeader_fair

      location {
        ...LocationMap_location
      }

      organizer {
        profile {
          name
        }
      }
    }
  `
)
