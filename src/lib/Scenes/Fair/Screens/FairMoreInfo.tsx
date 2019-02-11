import { Box, Separator, Serif, Spacer } from "@artsy/palette"
import { FairMoreInfoQuery } from "__generated__/FairMoreInfoQuery.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"
import { Fair } from "../Fair"

const ListHeaderText = styled(Serif)`
  height: 36px;
`

interface Props extends ViewProperties {
  fair: FairMoreInfoQuery["response"]["fair"]
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

    if (fair.organizer || fair.ticketsLink) {
      sections.push({
        type: "links",
        data: {
          links: fair.organizer,
          ticketsLink: fair.ticketsLink,
        },
      })
    }

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
            {data.organizer &&
              data.organizer.website(
                <>
                  <CaretButton text="View fair site" onPress={() => this.openUrl(data.organizer.website)} />
                  <Spacer m={1} />
                </>
              )}
            {data.ticketsLink && <CaretButton text="Buy tickets" onPress={() => this.openUrl(data.ticketsLink)} />}
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
              <Box py={3} px={2}>
                <Separator />
              </Box>
            </>
          }
          ItemSeparatorComponent={this.renderItemSeparator}
          keyExtractor={(item, index) => item.type + String(index)}
        />
      </Box>
    )
  }
}

export const FairMoreInfoRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairMoreInfoQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairMoreInfoQuery($fairID: String!) {
        fair(id: $fairID) {
          organizer {
            website
          }
          about
          ticketsLink
        }
      }
    `}
    variables={{ fairID }}
    render={renderWithLoadProgress<Props>(FairMoreInfo)}
  />
)
