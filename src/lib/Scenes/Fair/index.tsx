import { Box, Separator, Theme } from "@artsy/palette"
import { Fair_fair } from "__generated__/Fair_fair.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { HoursCollapsible } from "lib/Components/HoursCollapsible"
import { LocationMapContainer as LocationMap, PartnerType } from "lib/Components/LocationMap"
import { FairHeaderContainer as FairHeader } from "./Components/FairHeader"
import { SearchLink } from "./Components/SearchLink"

interface Props extends ViewProperties {
  fair: Fair_fair
}

interface State {
  sections: Array<{
    type: "hours" | "location"
    data: any
  }>
  extraData?: { animatedValue: { height: number } }
}

export class Fair extends React.Component<Props, State> {
  state: State = {
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
      type: "hours",
      data: {
        hours: fair.hours,
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
        return <LocationMap partnerType="Fair" {...data} />
      case "hours":
        return <HoursCollapsible {...data} onAnimationFrame={this.handleAnimationFrame} />
      case "search":
        return <SearchLink {...data} />
      default:
        return null
    }
  }

  handleAnimationFrame = animatedValue => {
    /**
     * If children change their size on animation (e.g. HoursCollapsible), we need a sentinel value
     * in state in order to trigger a re-render, as FlatList statically sizes child cells.
     */
    this.setState({
      extraData: {
        ...this.state.extraData,
        animatedValue,
      },
    })
  }

  render() {
    const { fair } = this.props
    const { sections, extraData } = this.state

    return (
      <Theme>
        <FlatList
          keyExtractor={(item, index) => item.type + String(index)}
          extraData={extraData}
          data={sections}
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
      hours
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
