import { DecreaseIcon, Flex, IncreaseIcon, Text } from "palette"
import React from "react"

interface AuctionResultsMidEstimateProps {
  value: string
  shortDescription: string
}

type ArrowDirections = "up" | "down"

export const AuctionResultsMidEstimate: React.FC<AuctionResultsMidEstimateProps> = ({ value, shortDescription }) => {
  const arrowDirection: ArrowDirections = value[0] !== "-" ? "up" : "down"

  const color = ratioColor(value)

  return (
    <Flex flexDirection="row" alignItems="center">
      {arrowDirection === "up" ? (
        <IncreaseIcon bottom={"2px"} height={12} fill={color} />
      ) : (
        <DecreaseIcon bottom={"2px"} height={12} fill={color} />
      )}
      <Text variant="small" color={color}>
        {value.replace("-", "")} {shortDescription}
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
