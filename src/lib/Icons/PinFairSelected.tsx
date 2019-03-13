import React from "react"
import Svg, { G, Path } from "react-native-svg"

const PinFairSelected = props => (
  <Svg width={29} height={65} viewBox="0 0 31 7" {...props}>
    <G fill="none" fillRule="evenodd" transform="translate(3.5,-1)">
      <Path fill="#FFF" d="M9-4.8h10v8H7z" />
      <Path
        d="M14.625-15.967A3.366 3.366 0 0 0 13-16.8a3.365 3.365 0 0 0-1.625.833C5.705-11.785 0-7.985 0-.133 0 7.719 6.845 15.969 11.702 22.54c.308.416.788.66 1.298.66s.99-.244 1.298-.66C19.155 15.968 26 7.718 26-.133c0-7.852-5.705-11.652-11.375-15.834zM18.386.521l-4.872 4.132a.79.79 0 0 1-1.032 0L7.61.521a.888.888 0 0 1-.306-.674c0-.26.112-.506.306-.673l4.872-4.132a.79.79 0 0 1 1.032 0l4.873 4.132a.888.888 0 0 1 .306.673c0 .26-.113.507-.307.674z"
        fill="#6E1EFF"
        fillRule="nonzero"
      />
    </G>
  </Svg>
)

export default PinFairSelected
