import { Flex, Text } from "palette"
import { DecreaseIcon } from "palette/svgs/DecreaseIcon"
import { IncreaseIcon } from "palette/svgs/IncreaseIcon"
import React from "react"
import { color } from "styled-system"

interface AuctionResultsMidEstimateProps {
  percentage: string
}

type ArrowDirections = "up" | "down"

export const AuctionResultsMidEstimate: React.FC<AuctionResultsMidEstimateProps> = ({ percentage }) => {
  const arrowDirection: ArrowDirections = percentage[0] !== "-" ? "up" : "down"

  return (
    <Flex flexDirection="row">
      {arrowDirection === "up" ? <IncreaseIcon fill={color("green100")} /> : <DecreaseIcon fill={color("red100")} />}
      <Text variant="mediumText" color={ratioColor(percentage)}>
        {percentage} mid-estimate
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
