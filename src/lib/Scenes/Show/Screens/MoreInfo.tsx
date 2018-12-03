import { Box, Separator } from "@artsy/palette"
import { MoreInfo_show } from "__generated__/MoreInfo_show.graphql"
import React from "react"
import { FlatList, NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { TextSection } from "../Components/TextSection"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  show: MoreInfo_show
}

interface State {
  sections: Array<{
    type: "opening-reception" | "press-release"
    data: any
  }>
}

export class MoreInfo extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { show: _show } = this.props
    // FIXME: opening reception field does not exist, stubbed for now
    const show = {
      ..._show,
      opening_reception: "Thursday, Oct. 18th, 6pm-8pm\n\nArtists in attendance. Please RSVP.",
    }

    const sections = []

    // TODO: check for stub and availability of data

    sections.push({
      type: "opening-reception",
      data: show,
    })

    sections.push({
      type: "press-release",
      data: show,
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
      case "opening-reception":
        return <TextSection title="Opening Reception" text={data.opening_reception} />
      case "press-release":
        return <TextSection title="Press Release" text={data.press_release} />
    }
  }

  render() {
    return (
      <FlatList
        data={this.state.sections}
        ItemSeparatorComponent={this.renderItemSeparator}
        renderItem={item => (
          <Box mb={2} px={2}>
            {this.renderItem(item)}
          </Box>
        )}
        keyExtractor={(item, index) => item.type + String(index)}
      />
    )
  }
}

export const MoreInfoContainer = createFragmentContainer(
  MoreInfo,
  graphql`
    fragment MoreInfo_show on Show {
      press_release
    }
  `
)
