import React from "react"
import Svg, { G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */

const PinSavedOff = props => (
  <Svg width={45} height={45} viewBox="0 0 18 24" {...props}>
    <G fillRule="nonzero" stroke="#666" fill="none">
      <Path
        d="M9.406 23.182c.273-.349 1.923-2.428 2.408-3.053 2.75-3.539 4.335-6.09 5.108-8.607.3-.976.453-1.906.453-2.795C17.375 4.257 13.63.625 9 .625S.625 4.257.625 8.727c0 .89.153 1.82.453 2.795.773 2.518 2.358 5.068 5.108 8.607.485.625 2.135 2.705 2.407 3.053.095.12.245.193.407.193a.516.516 0 0 0 .406-.193z"
        strokeWidth={1.25}
        opacity={0.4}
      />
      <Path strokeWidth={1.5} opacity={0.5} d="M12.115 7.133l-3.824 5.045-2.518-2.9" />
    </G>
  </Svg>
)

export default PinSavedOff
