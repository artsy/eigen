import { DecreaseIcon, Flex, IncreaseIcon, Text, TextVariant } from "palette"
import React from "react"

interface AuctionResultsMidEstimateProps {
  value: string
  shortDescription: string
  textVariant?: TextVariant
}

type ArrowDirections = "up" | "down"

export const AuctionResultsMidEstimate: React.FC<AuctionResultsMidEstimateProps> = ({
  value,
  textVariant = "small",
  shortDescription,
}) => {
  const arrowDirection: ArrowDirections = value[0] !== "-" ? "up" : "down"

  const color = ratioColor(value)

  return (
    <Flex flexDirection="row" alignItems="center">
      {/* Up arrow is heavier toward bottom so appears off center without padding */}
      {arrowDirection === "up" ? (
        <IncreaseIcon bottom={"1px"} height={12} fill={color} />
      ) : (
        <DecreaseIcon height={12} fill={color} />
      )}
      <Text variant={textVariant} color={color}>
        {new Intl.NumberFormat().format(Number(value.replace(/%|-/gm, "")))}% {shortDescription}
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
