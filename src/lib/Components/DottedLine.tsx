import * as PropTypes from "prop-types"
import * as React from "react"
import { ColorPropType, processColor, requireNativeComponent, View } from "react-native"
import colors from "../../data/colors"

interface Props {
  /** Custom scaling for the dots themselves (default: 1) */
  scale?: number
  /** The color of the dots (default: Artsy grey-regular) */
  color?: string
  /** The background color (default: 'white') */
  backgroundColor?: string
}

class DottedLine extends React.Component<Props, null> {
  static propTypes = {
    scale: PropTypes.number,
    color: ColorPropType,
    processedBackgroundColor: ColorPropType,
  }
  static defaultProps = {
    scale: 1,
    color: colors["grey-regular"],
    backgroundColor: "white",
  }
  render() {
    const colorProps = {
      color: processColor(this.props.color),
      processedBackgroundColor: processColor(this.props.backgroundColor),
    }
    return <NativeDottedLine style={{ height: this.props.scale * 2 }} {...colorProps} />
  }
}

export default DottedLine

const NativeDottedLine: React.ComponentClass<any> = requireNativeComponent("ARDottedLine", DottedLine)
