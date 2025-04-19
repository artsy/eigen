import { Text, TextProps } from "@artsy/palette-mobile"

interface AuctionResultsMidEstimateProps {
  value: string
  shortDescription?: string
  textVariant?: TextProps["variant"]
}

export const AuctionResultsMidEstimate: React.FC<AuctionResultsMidEstimateProps> = ({
  value,
  textVariant = "xs",
  shortDescription,
}) => {
  const color = ratioColor(value)

  return (
    <Text variant={textVariant} color={color} fontWeight="500">
      ({value[0] === "-" ? "-" : "+"}
      {new Intl.NumberFormat().format(Number(value.replace(/%|-/gm, "")))}%
      {!!shortDescription && ` ${shortDescription}`})
    </Text>
  )
}

export const ratioColor = (ratioString: string) => {
  const ratio = Number(ratioString.replace("%", ""))
  if (ratio >= 5) {
    return "green100"
  }
  if (ratio <= -5) {
    return "red100"
  }

  return "mono60"
}
