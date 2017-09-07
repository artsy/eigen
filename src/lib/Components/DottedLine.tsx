import * as PropTypes from "prop-types"
import * as React from "react"
import { ColorPropType, processColor, requireNativeComponent, View } from "react-native"
import colors from "../../data/colors"

interface Props {
  /** The color of the dots (default: Artsy grey-regular) */
  color?: string
}

class DottedLine extends React.Component<Props, null> {
  static propTypes = {
    color: ColorPropType,
  }
  render() {
    return <NativeDottedLine style={{ height: 2 }} color={processColor(this.props.color || colors["gray-medium"])} />
  }
}

export default DottedLine

const NativeDottedLine: React.ComponentClass<any> = requireNativeComponent("ARDottedLine", DottedLine)
