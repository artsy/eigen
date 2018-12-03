import { Box, Separator, Theme } from "@artsy/palette"
import { Fair_fair } from "__generated__/Fair_fair.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { LocationMapContainer as LocationMap, PartnerType } from "lib/Components/LocationMap"
import { FairHeaderContainer as FairHeader } from "./Components/FairHeader"
import { SearchLink } from "./Components/SearchLink"

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
        partnerName: !!fair.organizer ? fair.organizer.profile.name : fair.name,
        partnerType: PartnerType.fair,
      },
    })

    sections.push({
      type: "search",
      data: {
        fairID: fair.id,
      },
    })

    this.setState({ sections })
  }

  renderItemSeparator = () => (
    <Box py={2} px={2}>
      <Separator />
    </Box>
  )

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "location":
        return <LocationMap {...data} />
      case "search":
        return <SearchLink {...data} />
      default:
        return null
    }
  }

  render() {
    const { fair } = this.props

    return (
      <Theme>
        <FlatList
          keyExtractor={(item, index) => item.type + String(index)}
          data={this.state.sections}
          ListHeaderComponent={<FairHeader fair={fair} />}
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
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
      id
      name

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
