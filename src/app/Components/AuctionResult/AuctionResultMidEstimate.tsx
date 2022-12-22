import { Flex, Text, TextProps } from "palette"

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
    <Flex flexDirection="row" pt="3px">
      <Text variant={textVariant} color={color} fontWeight="500">
        ({value[0] === "-" ? "-" : "+"}
        {new Intl.NumberFormat().format(Number(value.replace(/%|-/gm, "")))}%
      </Text>
      {!!shortDescription && (
        <Text variant={textVariant} color={color} fontWeight="500">
          {" "}
          {shortDescription}
        </Text>
      )}
      <Text variant={textVariant} color={color} fontWeight="500">
        )
      </Text>
    </Flex>
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

  return "black60"
}
