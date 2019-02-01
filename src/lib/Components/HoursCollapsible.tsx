import { Box, Collapse as _Collapse, color, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { defaultRules, Markdown } from "lib/Components/Markdown"
import { isArray, isString } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

const Chevron = styled.Image<{ isExpanded: boolean }>`
  height: 8;
  width: 15;
  align-self: center;
  opacity: 0.3;
  ${({ isExpanded }) => (isExpanded ? `transform: rotate(180deg)` : "")};
`

/**
 * FIXME: RN Collapse implementation diverges from web and we're using props
 * unavailable in exported type, see https://github.com/artsy/palette/issues/137
 */
const Collapse = _Collapse as React.ComponentClass<any>

interface Props {
  hours: string | Array<{ hours: string; days: string }>
  onAnimationFrame?: ({ height: number }) => void
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
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  handleAnimationFrame = animatedValue => {
    if (this.props.onAnimationFrame) {
      this.props.onAnimationFrame(animatedValue)
    }
  }

  renderHours() {
    const { hours } = this.props
    if (isString(hours)) {
      console.log("hours1", hours)
      return <Markdown rules={markdownRules}>{hours}</Markdown>
    } else if (isArray(hours)) {
      return hours.map((daySchedule, idx, arr) => {
        console.log("daySchedule.days", daySchedule.days)
        console.log("daySchedule.hours", daySchedule.hours)
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
              <Chevron source={require("../../../images/chevron.png")} isExpanded={isExpanded} />
            </Box>
          </Flex>
        </TouchableWithoutFeedback>
        <Collapse open={isExpanded} onAnimationFrame={this.handleAnimationFrame}>
          <Box mt={2}>{this.renderHours()}</Box>
        </Collapse>
      </Box>
    )
  }
}
