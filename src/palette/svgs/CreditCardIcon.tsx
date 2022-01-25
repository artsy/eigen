import React from "react"
import { Circle, G, Icon, IconProps, Path, Rect } from "./Icon"

/** https://stripe.com/docs/api#card_object-brand */
export type CreditCardType = "American Express" | "Discover" | "MasterCard" | "Unknown" | "Visa"

interface CreditCardIconProps extends IconProps {
  type?: CreditCardType
}

/** CreditCardIcon */
export const CreditCardIcon = ({ type, ...rest }: CreditCardIconProps) => {
  const { parts } = cardTypeMap[type ?? "Unknown"] || cardTypeMap.Unknown

  return (
    <Icon viewBox="0 0 30 20" {...rest}>
      {parts}
    </Icon>
  )
}

const AmexIcon = () => (
  <>
    <G fill="none" fillRule="evenodd">
      <Rect stroke="#E5E5E5" fill="#EFEFEF" x=".5" y=".5" width="29" height="19" rx="2" />
      <G fill="#4DB3FF">
        <Path d="M9.999 11A.999.999 0 0 0 9 12.01v1.98c0 .558.439 1.01.999 1.01H30v-4H9.999zM0 6v4h20.001A.999.999 0 0 0 21 8.99V7.01A.999.999 0 0 0 20.001 6H0z" />
      </G>
      <Rect stroke="#E5E5E5" x=".5" y=".5" width="29" height="19" rx="2" />
    </G>
  </>
)

const DiscoverIcon = () => (
  <>
    <G fill="none" fillRule="evenodd">
      <Rect fill="#EFEFEF" width="30" height="20" rx="2" />
      <Path d="M12 20h16.005A1.992 1.992 0 0 0 30 18.002V12l-18 8z" fill="#FFB44F" />
      <Rect fill="#D4D4D4" x="5" y="5" width="20" height="3" rx="1.5" />
      <Rect stroke="#E5E5E5" x=".5" y=".5" width="29" height="19" rx="2" />
    </G>
  </>
)

const FallbackIcon = () => (
  <>
    <G fill="none" fillRule="evenodd">
      <Rect stroke="#E5E5E5" fill="#EFEFEF" x=".5" y=".5" width="29" height="19" rx="2" />
      <Rect fill="#D4D4D4" x="5" y="5" width="20" height="3" rx="1.5" />
      <Rect fill="#D4D4D4" x="5" y="10" width="7" height="3" rx="1.5" />
    </G>
  </>
)

const MastercardIcon = () => (
  <>
    <G fill="none" fillRule="evenodd">
      <Rect stroke="#E5E5E5" fill="#EFEFEF" x=".5" y=".5" width="29" height="19" rx="2" />
      <G transform="translate(6 5)">
        <Circle fill="#FFB44F" cx="13" cy="5" r="5" />
        <Circle fill="#CE4747" cx="5" cy="5" r="5" />
        <Path
          d="M9 8a4.977 4.977 0 0 1-1-3c0-1.126.372-2.164 1-3 .628.836 1 1.874 1 3a4.977 4.977 0 0 1-1 3z"
          fill="#D6765F"
        />
      </G>
    </G>
  </>
)
const VisaIcon = () => (
  <>
    <G fill="none" fillRule="evenodd">
      <Rect stroke="#E5E5E5" fill="#EFEFEF" x=".5" y=".5" width="29" height="19" rx="2" />
      <Path
        d="M0 14v4.002C0 19.106.898 20 1.992 20h26.016c1.1 0 1.992-.898 1.992-1.998V14H0z"
        fill="#FFB44F"
      />
      <Path
        d="M1.992 0C.892 0 0 .898 0 1.998V6h30V1.998A1.999 1.999 0 0 0 28.008 0H1.992z"
        fill="#4287CB"
      />
    </G>
  </>
)

const cardTypeMap = {
  "American Express": { parts: <AmexIcon />, title: "amex" },
  Discover: { parts: <DiscoverIcon />, title: "discover" },
  MasterCard: { parts: <MastercardIcon />, title: "mastercard" },
  Unknown: { parts: <FallbackIcon />, title: "credit card" },
  Visa: { parts: <VisaIcon />, title: "visa" },
}
