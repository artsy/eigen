import React from "react"
import Svg, { Path } from "react-native-svg"

const HighDemandIcon = (props: React.ComponentProps<typeof Svg>) => (
  <Svg width={14} height={14} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.00065 14.6668C11.6825 14.6668 14.6673 11.6821 14.6673 8.00016C14.6673 4.31826 11.6825 1.3335 8.00065 1.3335C4.31875 1.3335 1.33398 4.31826 1.33398 8.00016C1.33398 11.6821 4.31875 14.6668 8.00065 14.6668ZM11.825 6.22216L11.4677 8.4935L10.6736 7.82129L8.45131 9.70698L8.16375 9.95098L7.8762 9.70698L6.79125 8.78637L5.02004 10.2893L4.44493 9.61152L6.50369 7.8646L6.79125 7.62061L7.0788 7.8646L8.16375 8.78522L9.98588 7.23909L9.14902 6.53066L11.825 6.22216Z"
      fill="#1023D7"
    />
  </Svg>
)

export default HighDemandIcon
