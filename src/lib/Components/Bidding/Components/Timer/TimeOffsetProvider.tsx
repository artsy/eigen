import * as PropTypes from "prop-types"
import React from "react"

interface Props {
  children: React.ReactElement<any>
}

export class TimeOffsetProvider extends React.Component<Props> {
  static contextTypes = {
    timeOffsetInMilliSeconds: PropTypes.number,
  }

  render() {
    return React.cloneElement(this.props.children, this.context || {})
  }
}
