import React, { Component } from "react"
import { Ellipse, G, Path, Svg } from "react-native-svg"

interface CircleWhiteCheckIconProps {
  width: number | string
  height: number | string
}

/** Icon */
export class CircleWhiteCheckIcon extends Component<CircleWhiteCheckIconProps> {
  render() {
    const { width, height, ...rest } = this.props

    return (
      <Svg width={this.props.width} height={this.props.height} viewBox="0 0 26 27" {...rest}>
        <G stroke="#000" fill="none" fillRule="evenodd">
          <Ellipse cx="13" cy="13.5" rx="12.5" ry="13" />
          <Path strokeWidth="2" strokeLinecap="square" d="M8 14.3l3.21 3.34 6-6.22" />
        </G>
      </Svg>
    )
  }
}
