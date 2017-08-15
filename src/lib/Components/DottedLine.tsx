import * as React from "react"
import { requireNativeComponent, View } from "react-native"

class DottedLine extends React.Component<any, any> {
  static propTypes = { dotScale: React.PropTypes.number }
  static defaultProps = { dotScale: 1 }
  render() {
    return <NativeDottedLine style={{ height: this.props.dotScale * 2 }} />
  }
}

export default DottedLine

const NativeDottedLine: React.ComponentClass<any> = requireNativeComponent("ARDottedLine", DottedLine)
