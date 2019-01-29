import { Box, Separator, Serif } from "@artsy/palette"
import { FairExhibitorsQuery } from "__generated__/FairExhibitorsQuery.graphql"
import React from "react"
import { SectionList, TouchableOpacity, ViewProperties } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import SwitchBoard from "../../../../lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props extends ViewProperties {
  fair: FairExhibitorsQuery["response"]["fair"]
}

interface State {
  sections: Array<{
    items: any
    letter: string
    index: number
    sections: any
  }>
}
export class FairExhibitors extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    if (!fair) {
      return
    }
    const sections = [] as any
    const exhibitorsGroupedByName = fair.exhibitors_grouped_by_name || []
    exhibitorsGroupedByName.forEach(group => {
      sections.push({
        title: group.letter,
        data: group.exhibitors,
        partnerIds: group.profile_ids,
        count: group.exhibitors.length,
      })
    })
    this.setState({ sections })
  }

  renderExhibitor(item, index, section) {
    const { partnerIds, count } = section
    const generatedKey = count - index
    return (
      <Box mb={2} key={generatedKey}>
        <TouchableOpacity onPress={() => SwitchBoard.presentNavigationViewController(this, partnerIds[index])}>
          <Serif size="3">{item}</Serif>
        </TouchableOpacity>
      </Box>
    )
  }

  render() {
    return (
      <SectionList
        stickySectionHeadersEnabled={true}
        renderItem={({ item, index, section }) => <Box px={2}>{this.renderExhibitor(item, index, section)}</Box>}
        ListHeaderComponent={() => {
          return (
            <Box px={2} mb={2} pt={85}>
              <Serif size="8">All exhibitors</Serif>
            </Box>
          )
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Box px={2} mb={2}>
            <Serif size="4">{title}</Serif>
          </Box>
        )}
        renderSectionFooter={({ section }) => {
          if (section.index < this.state.sections.length - 1) {
            return (
              <Box px={2} pb={2}>
                <Separator />
              </Box>
            )
          }
        }}
        sections={this.state.sections}
        keyExtractor={(item, index) => item + index}
      />
    )
  }
}

export const FairExhibitorsRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairExhibitorsQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairExhibitorsQuery($fairID: String!) {
        fair(id: $fairID) {
          exhibitors_grouped_by_name {
            letter
            exhibitors
            profile_ids
          }
        }
      }
    `}
    variables={{ fairID }}
    render={renderWithLoadProgress<Props>(FairExhibitors)}
  />
)
