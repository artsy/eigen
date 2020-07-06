import React from "react"
import Svg, { Path } from "react-native-svg"

export const ProfileActiveIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width="56" height="52" viewBox="0 0 56 52" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.2329 17.3746C25.8913 17.3746 23.7806 18.7861 22.886 20.9501C21.9915 23.1141 22.4895 25.6039 24.1476 27.2573C25.8058 28.9107 28.297 29.4016 30.4584 28.5009C32.6199 27.6002 34.0253 25.4855 34.0186 23.1439C34.0095 19.9549 31.4218 17.3746 28.2329 17.3746Z"
      fill="black"
    />
    <Path
      d="M34.0021 30.9467C36.278 30.9467 38.123 32.7917 38.123 35.0676V40.0126H18.3428V35.0676C18.3428 32.7917 20.1878 30.9467 22.4637 30.9467H34.0021Z"
      fill="black"
    />
  </Svg>
)
