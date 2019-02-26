import { Box, color, Flex, Sans, Serif, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import moment from "moment"
import React from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"

const RoundedImage = styled(OpaqueImageView)`
  width: 62;
  border-radius: 30;
  overflow: hidden;
`

const RoundedBox = styled(Box)`
  width: 62;
  height: 62;
  border-radius: 30;
  overflow: hidden;
`

const SquareBox = styled(Box)`
  width: 58;
  height: 58;
`

export interface Props {
  item: any
  type: string
}

export const formatDuration = (startAt, endAt) => {
  const momentStartAt = moment(startAt)
  const momentEndAt = moment(endAt)
  if (momentStartAt.dayOfYear() === momentEndAt.dayOfYear() && momentStartAt.year() === momentEndAt.year()) {
    // duration is a time range within a single day
    return `${momentStartAt.format("MMM D")}`
  } else if (momentStartAt.month() === momentEndAt.month()) {
    // duration is a time range within same month
    return `${momentStartAt.format("MMM D")} - ` + momentEndAt.format("D")
  } else {
    // duration spans more than one day
    return `${momentStartAt.format("MMM D")} - ` + momentEndAt.format("MMM D")
  }
}

const renderImage = (image, type) => {
  if (!!image && type === "Fairs") {
    return <RoundedImage aspectRatio={1} imageURL={image.url} />
  } else if (!!image) {
    return <OpaqueImageView width={58} imageURL={image.url} />
  } else if (type === "Fairs") {
    return <RoundedBox background={color("black30")} />
  } else {
    return <SquareBox background={color("black30")} />
  }
}

const renderText = (item, type) => {
  console.log("item", item)
  if (type === "Fairs") {
    return (
      <>
        {item.name && (
          <Sans weight="medium" size="3t" numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Sans>
        )}
        {item.counts.partners && (
          <Serif size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
            {item.counts.partners > 1 ? `${item.counts.partners} Exhibitors` : `${item.counts.partners} Exhibitor`}
          </Serif>
        )}
        {item.start_at &&
          item.end_at && (
            <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
              {formatDuration(item.start_at, item.end_at)}
            </Sans>
          )}
      </>
    )
  } else {
    return (
      <>
        <Sans weight="medium" size="3t" numberOfLines={1} ellipsizeMode="tail">
          {"a"}
        </Sans>
        <Serif size="3t" numberOfLines={1} ellipsizeMode="tail">
          {"b"}
        </Serif>
        <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
          {"c"}
        </Sans>
      </>
    )
  }
}

export const TabListItem: React.SFC<Props> = (props: Props) => {
  const { item, type } = props
  const boxWidth = Dimensions.get("window").width - 62 - space(4) - space(1)
  return (
    <Box py={2}>
      <Flex flexWrap="nowrap" flexDirection="row" alignItems="center">
        {renderImage(item.image, type)}
        <Box width={boxWidth} pl={1}>
          {renderText(item, type)}
        </Box>
      </Flex>
    </Box>
  )
}
