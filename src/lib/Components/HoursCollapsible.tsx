import { Box, Flex, Sans, Serif } from "@artsy/palette"
// import { Markdown } from "lib/Components/Markdown"
import { isArray, isString, uniqBy } from "lodash"
import moment from "moment"
import React from "react"
import { Image, ImageURISource, TouchableWithoutFeedback } from "react-native"

// tslint:disable-next-line:no-var-requires
const chevron: ImageURISource = require("../../../images/chevron.png")

interface Props {
  hours: string | Array<{ day_of_week: string; start_time: number; end_time: number }>
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

  renderHours() {
    const { hours } = this.props
    if (isString(hours)) {
      return <Sans size="3">{hours}</Sans>
    } else if (isArray(hours)) {
      return uniqBy(hours, "day_of_week").map(({ start_time, end_time, day_of_week }) => {
        return (
          <Box key={day_of_week + String(start_time) + String(end_time)}>
            <Sans size="3" weight="medium">
              {day_of_week}
            </Sans>
            <Serif size="3" color="black60">
              {formatTime(start_time)}–{formatTime(end_time)}
            </Serif>
          </Box>
        )
      })
    }
  }

  returnChevron(isExpanded) {
    if (isExpanded) {
      return (
        <Image
          style={{
            height: 8,
            width: 15,
            alignSelf: "center",
            resizeMode: "center",
            opacity: 0.3,
            transform: [{ rotate: "180deg" }],
          }}
          source={chevron}
        />
      )
    } else {
      return (
        <Image
          style={{ height: 8, width: 15, alignSelf: "center", resizeMode: "center", opacity: 0.3 }}
          source={chevron}
        />
      )
    }
  }

  render() {
    const { isExpanded } = this.state
    return (
      <Box mt={2}>
        <TouchableWithoutFeedback onPress={this.handleToggleIsExpanded}>
          <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mb={2}>
            <Sans size="4">Hours</Sans>
            {this.returnChevron(isExpanded)}
          </Flex>
        </TouchableWithoutFeedback>
        {isExpanded && <Box mb={2}>{this.renderHours()}</Box>}
      </Box>
    )
  }
}
