import { Box, Collapse as _Collapse, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { Markdown } from "lib/Components/Markdown"
import { isArray, isString } from "lodash"
import moment from "moment"
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

export function formatTime(time) {
  const hourMoment = moment().hour(time / 60 / 60)
  const minutesMoment = moment().minutes(time / 60)
  const amPm = hourMoment.hour() >= 12 ? "pm" : "am"
  return hourMoment.format("h") + (minutesMoment.format("mm") === "00" ? "" : minutesMoment.format(":mm")) + amPm
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
      return <Markdown size="3">{hours}</Markdown>
    } else if (isArray(hours)) {
      return hours.map((daySchedule, idx, arr) => {
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
      <Box mt={2}>
        <TouchableWithoutFeedback onPress={this.handleToggleIsExpanded}>
          <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
            <Sans size="3t" weight="medium">
              Hours
            </Sans>
            <Chevron source={require("../../../images/chevron.png")} isExpanded={isExpanded} />
          </Flex>
        </TouchableWithoutFeedback>
        <Collapse open={isExpanded} onAnimationFrame={this.handleAnimationFrame}>
          <Box mt={2}>{this.renderHours()}</Box>
        </Collapse>
      </Box>
    )
  }
}
