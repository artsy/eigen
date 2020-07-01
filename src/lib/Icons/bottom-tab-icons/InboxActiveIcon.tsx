import React from "react"
import Svg, { Path } from "react-native-svg"

export const InboxActiveIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.959 18.1624C17.2093 17.8034 17.6144 17.5901 18.0461 17.5901H22.3921C23.4974 17.5901 24.3934 16.6755 24.3934 15.5473V2.99178C24.3934 1.86355 23.4974 0.948944 22.3921 0.948944H2.60776C1.50247 0.948944 0.606445 1.86355 0.606445 2.99178V15.5473C0.606445 16.6755 1.50247 17.5901 2.60776 17.5901H6.953C7.38472 17.5901 7.78976 17.8034 8.04007 18.1624L11.1407 22.61C11.8056 23.5638 13.1934 23.5638 13.8584 22.61L16.959 18.1624Z"
      fill="black"
    />
  </Svg>
)
