import {
  AmexIcon,
  CartesBancairesIcon,
  CreditCardIcon,
  DinersClubIcon,
  DiscoverIcon,
  IconProps,
  JcbIcon,
  MastercardIcon,
  UnionPayIcon,
  VisaIcon,
} from "@artsy/icons/native"

export type Brand =
  | "Visa"
  | "MasterCard"
  | "American Express"
  | "Discover"
  | "Cartes Bancaires"
  | "Diners Club"
  | "JCB"
  | "UnionPay"
  | "Unknown"
  | (string & {})

interface BrandCreditCardIconProps extends IconProps {
  type: Brand
}

export const BrandCreditCardIcon: React.FC<BrandCreditCardIconProps> = ({ type, ...rest }) => {
  switch (type) {
    case "Visa":
      return <VisaIcon {...rest} />
    case "MasterCard":
      return <MastercardIcon {...rest} />
    case "American Express":
      return <AmexIcon {...rest} />
    case "Discover":
      return <DiscoverIcon {...rest} />
    case "Cartes Bancaires":
      return <CartesBancairesIcon {...rest} />
    case "Diners Club":
      return <DinersClubIcon {...rest} />
    case "JCB":
      return <JcbIcon {...rest} />
    case "UnionPay":
      return <UnionPayIcon {...rest} />
    default:
      return <CreditCardIcon color="mono30" {...rest} />
  }
}
