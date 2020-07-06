import React from "react"
import Svg, { Path } from "react-native-svg"

export const InboxActiveIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width="56" height="52" viewBox="0 0 56 52" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32.8464 35.2559C33.1054 34.8845 33.5245 34.6638 33.9712 34.6638H38.4678C39.6114 34.6638 40.5384 33.7175 40.5384 32.5502V19.5597C40.5384 18.3923 39.6114 17.446 38.4678 17.446H17.9979C16.8543 17.446 15.9272 18.3923 15.9272 19.5597V32.5502C15.9272 33.7175 16.8543 34.6638 17.9979 34.6638H22.4937C22.9404 34.6638 23.3595 34.8845 23.6184 35.2559L26.8265 39.8577C27.5145 40.8445 28.9504 40.8445 29.6384 39.8577L32.8464 35.2559Z"
      fill="black"
    />
  </Svg>
)
