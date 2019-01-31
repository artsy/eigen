import React from "react"
import Svg, { Path } from "react-native-svg"

const SearchIcon = props => (
  <Svg width={14} height={14} viewBox="0 0 54 54" {...props}>
    <Path
      d="M49.7 46.9L38.2 35.3c2.5-3.1 4-7 4-11.3C42.1 14 34 5.9 24 5.9S5.9 14 5.9 24C5.9 34 14 42.1 24 42.1c4.3 0 8.2-1.5 11.3-4l11.6 11.6c.4.4 1 .4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4zM10 24c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14-14-6.3-14-14z"
      fill="#666"
      fillRule="nonzero"
    />
  </Svg>
)

export default SearchIcon
