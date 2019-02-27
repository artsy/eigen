import { Box, color, Flex, Sans, Serif, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import moment from "moment"
import React from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"

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

const renderImage = (url, type) => {
  if (!!url && type === "Fairs") {
    return <RoundedImage aspectRatio={1} imageURL={url} />
  } else if (!!url) {
    return <OpaqueImageView width={58} height={58} imageURL={url} />
  } else if (type === "Fairs") {
    return <RoundBox background={color("black30")} />
  } else {
    return <SquareBox background={color("black30")} />
  }
}

const renderContent = (item, type) => {
  const boxWidth = Dimensions.get("window").width - 62 - space(4) - space(1)
  switch (type) {
    case "Fairs":
      const fairImage = item.node.image ? item.node.image.url : null
      return (
        <>
          {renderImage(fairImage, type)}
          <Box width={boxWidth} pl={1}>
            {item.node.name && (
              <Sans weight="medium" size="3t" numberOfLines={1} ellipsizeMode="tail">
                {item.node.name}
              </Sans>
            )}
            {item.node.counts.partners && (
              <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
                {item.node.counts.partners > 1
                  ? `${item.node.counts.partners} Exhibitors`
                  : `${item.node.counts.partners} Exhibitor`}
              </Sans>
            )}
            {item.node.start_at &&
              item.node.end_at && (
                <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
                  {formatDuration(item.node.start_at, item.node.end_at)}
                </Sans>
              )}
          </Box>
        </>
      )
    default:
      const galleryImage = item.node.cover_image ? item.node.cover_image.url : null
      return (
        <>
          {renderImage(galleryImage, type)}
          <Box width={boxWidth} pl={1}>
            {item.node.partner && (
              <Sans weight="medium" size="3t" numberOfLines={1} ellipsizeMode="tail">
                {item.node.partner.name}
              </Sans>
            )}
            {item.node.name && (
              <SerifTightened size="3t" numberOfLines={1} ellipsizeMode="tail">
                {item.node.name}
              </SerifTightened>
            )}
            {item.node.start_at &&
              item.node.end_at && (
                <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
                  {formatDuration(item.node.start_at, item.node.end_at)}
                </Sans>
              )}
          </Box>
        </>
      )
  }
}

export const TabListItem: React.SFC<Props> = (props: Props) => {
  const { item, type } = props
  return (
    <Box py={2}>
      <Flex flexWrap="nowrap" flexDirection="row" alignItems="center">
        {renderContent(item, type)}
      </Flex>
    </Box>
  )
}

const RoundedImage = styled(OpaqueImageView)`
  width: 62;
  border-radius: 30;
  overflow: hidden;
`

const RoundBox = styled(Box)`
  width: 62;
  height: 62;
  border-radius: 30;
  overflow: hidden;
`

const SquareBox = styled(Box)`
  width: 58;
  height: 58;
`

const SerifTightened = styled(Serif)`
  top: 3;
`
