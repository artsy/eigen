import { Box, Collapse as _Collapse, color, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import { defaultRules, Markdown } from "lib/Components/Markdown"
import ChevronIcon from "lib/Icons/ChevronIcon"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

/**
 * FIXME: RN Collapse implementation diverges from web and we're using props
 * unavailable in exported type, see https://github.com/artsy/palette/issues/137
 */
const Collapse = _Collapse as React.ComponentClass<any>

type OpeningHours = LocationMap_location["openingHours"]

interface Props {
  openingHours: OpeningHours
  onToggle?: (isExpanded: boolean) => void
}

interface State {
  isExpanded: boolean
}

const markdownRules = {
  ...defaultRules,
  paragraph: {
    ...defaultRules.paragraph,
    react: (node, output, state) => (
      <Serif size="3t" color="black100" key={state.key}>
        {output(node.content, state)}
      </Serif>
    ),
  },
}

export class HoursCollapsible extends React.Component<Props, State> {
  state = { isExpanded: false }

  handleToggleIsExpanded = () => {
    const isExpanded = !this.state.isExpanded
    this.setState({ isExpanded })

    if (this.props.onToggle) {
      this.props.onToggle(isExpanded)
    }
  }

  renderHours() {
    const { openingHours } = this.props
    if (openingHours.text) {
      return <Markdown rules={markdownRules}>{openingHours.text}</Markdown>
    } else if (openingHours.schedules) {
      return openingHours.schedules.map((daySchedule, idx, arr) => {
        return (
          <Box key={daySchedule.days}>
            <Sans size="3t" weight="medium">
              {daySchedule.days}
            </Sans>
            <Serif size="3t" color="black60">
              {daySchedule.hours}
            </Serif>
            {idx < arr.length - 1 && <Spacer m={0.5} />}
          </Box>
        )
      })
    }
  }

  render() {
    const { isExpanded } = this.state
    return (
      <Box>
        <TouchableWithoutFeedback onPress={this.handleToggleIsExpanded}>
          <Flex alignItems="center" flexDirection="row">
            <Sans size="3t" weight="medium" color={isExpanded ? color("black60") : color("black100")}>
              Opening hours
            </Sans>
            <Box ml={1}>
              <ChevronIcon initialDirection="down" expanded={isExpanded} />
            </Box>
          </Flex>
        </TouchableWithoutFeedback>
        <Collapse open={isExpanded}>
          <Box mt={2}>{this.renderHours()}</Box>
        </Collapse>
      </Box>
    )
  }
}
