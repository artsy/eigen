import { HoursCollapsible_location } from "__generated__/HoursCollapsible_location.graphql"
import { Markdown } from "lib/Components/Markdown"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { defaultRules } from "lib/utils/renderMarkdown"
import { Box, ClassTheme, Collapse as _Collapse, Flex, Sans, Spacer } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

/**
 * FIXME: RN Collapse implementation diverges from web and we're using props
 * unavailable in exported type, see https://github.com/artsy/palette/issues/137
 */
const Collapse = _Collapse as React.ComponentClass<any>

type OpeningHours = HoursCollapsible_location["openingHours"]

interface Props {
  openingHours: OpeningHours
  onToggle?: (isExpanded: boolean) => void
}

interface State {
  isExpanded: boolean
}

const basicRules = defaultRules({ modal: true })
const markdownRules = {
  ...basicRules,
  paragraph: {
    ...basicRules.paragraph,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    react: (node, output, state) => (
      <Sans size="3t" color="black100" key={state.key}>
        {output(node.content, state)}
      </Sans>
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
    if (openingHours && openingHours.text) {
      return <Markdown rules={markdownRules}>{openingHours.text}</Markdown>
    } else if (openingHours && openingHours.schedules) {
      return openingHours.schedules.map((daySchedule, idx, arr) => {
        return (
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          <Box key={daySchedule.days}>
            <Sans size="3t" weight="medium">
              {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                daySchedule.days
              }
            </Sans>
            <Sans size="3t" color="black60">
              {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                daySchedule.hours
              }
            </Sans>
            {idx < arr.length - 1 && <Spacer m={0.5} />}
          </Box>
        )
      })
    }
  }

  render() {
    const { isExpanded } = this.state
    return (
      <ClassTheme>
        {({ color }) => (
          <Box>
            <TouchableWithoutFeedback onPress={this.handleToggleIsExpanded}>
              <Flex alignItems="center" flexDirection="row">
                <Sans
                  size="3t"
                  weight="medium"
                  color={isExpanded ? color("black60") : color("black100")}
                >
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
        )}
      </ClassTheme>
    )
  }
}

export const HoursCollapsibleFragmentContainer = createFragmentContainer(HoursCollapsible, {
  location: graphql`
    fragment HoursCollapsible_location on Location {
      openingHours {
        ... on OpeningHoursArray {
          schedules {
            days
            hours
          }
        }
        ... on OpeningHoursText {
          text
        }
      }
    }
  `,
})
