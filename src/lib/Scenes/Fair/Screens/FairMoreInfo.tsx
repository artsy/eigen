import { Box, Separator, Serif, Spacer } from "@artsy/palette"
import { FairMoreInfo_fair } from "__generated__/FairMoreInfo_fair.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const ListHeaderText = styled(Serif)`
  height: 36px;
`

interface Props {
  fair: FairMoreInfo_fair
}

interface State {
  sections: Array<{
    type: "about" | "art-activations" | "links"
    data: any
  }>
}

export class FairMoreInfo extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    const sections = []

    sections.push({
      type: "about",
      data: {
        about: fair.about,
      },
    })

    // TODO: wire up bmw art activations
    // sections.push({
    //  type: "art-activations",
    //  data: {},
    // })

    sections.push({
      type: "links",
      data: {
        links: fair.links,
        tickets_link: fair.tickets_link,
      },
    })

    this.setState({ sections })
  }

  openUrl = url => {
    SwitchBoard.presentModalViewController(this, url)
  }

  renderItemSeparator = () => (
    <Box py={3} px={2}>
      <Separator />
    </Box>
  )

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "about":
        return <Serif size="3">{data.about}</Serif>
      case "art-activations":
        // TODO: render bmw art activations
        return null
      case "links":
        return (
          <>
            <CaretButton text="View fair site" onPress={() => this.openUrl(data.links)} />
            <Spacer m={1} />
            <CaretButton text="Buy tickets" onPress={() => this.openUrl(data.tickets_link)} />
          </>
        )
    }
  }

  render() {
    return (
      <Box mb={2}>
        <FlatList
          data={this.state.sections}
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
          ListHeaderComponent={
            <>
              <ListHeaderText size="8" mt={12} px={2}>
                About the fair
              </ListHeaderText>
              {this.renderItemSeparator()}
            </>
          }
          ItemSeparatorComponent={this.renderItemSeparator}
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Box>
    )
  }
}

export const FairMoreInfoContainer = createFragmentContainer(
  FairMoreInfo,
  graphql`
    fragment FairMoreInfo_fair on Fair {
      links
      about
      ticketsLink
    }
  `
)
