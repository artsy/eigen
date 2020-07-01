import React from "react"
import Svg, { Path } from "react-native-svg"

export const ProfileActiveIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={21} height={24} viewBox="0 0 21 24" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5 0.598755C8.15838 0.598764 6.04766 2.0102 5.15312 4.1742C4.25857 6.33819 4.7566 8.82802 6.41472 10.4814C8.07284 12.1348 10.5641 12.6257 12.7255 11.725C14.887 10.8243 16.2924 8.70958 16.2857 6.36799C16.2766 3.17906 13.6889 0.598742 10.5 0.598755Z"
      fill="black"
    />
    <Path
      d="M16.2692 14.1708C18.5451 14.1708 20.3901 16.0158 20.3901 18.2917V23.2367H0.609863V18.2917C0.609863 16.0158 2.45484 14.1708 4.73074 14.1708H16.2692Z"
      fill="black"
    />
  </Svg>
)
