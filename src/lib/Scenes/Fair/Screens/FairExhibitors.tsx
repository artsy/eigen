import { Box, Separator, Serif } from "@artsy/palette"
import { FairExhibitors_fair } from "__generated__/FairExhibitors_fair.graphql"
import React from "react"
import { SectionList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props extends ViewProperties {
  fair: FairExhibitors_fair
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
    const exhibitorsGroupedByName = (fair.exhibitors_grouped_by_name || []) as any
    exhibitorsGroupedByName.forEach(group => {
      sections.push({
        title: group.letter,
        data: group.exhibitors,
        count: group.exhibitors.length,
      })
    })
    this.setState({ sections })
  }

  renderExhibitor(item) {
    const { count, index } = item
    const generatedKey = count - index
    return (
      <Box mb={2} key={generatedKey}>
        <Serif size="3">{item}</Serif>
      </Box>
    )
  }

  render() {
    return (
      <SectionList
        stickySectionHeadersEnabled={true}
        renderItem={({ item }) => <Box px={2}>{this.renderExhibitor(item)}</Box>}
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

export const FairExhibitorsContainer = createFragmentContainer(
  FairExhibitors,
  graphql`
    fragment FairExhibitors_fair on Fair {
      exhibitors_grouped_by_name {
        letter
        exhibitors
      }
    }
  `
)
