import { Box, Flex, Sans, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export interface Props {
  item: any
}

export class TabFairItemRow extends React.Component<Props> {
  handleTap = item => {
    SwitchBoard.presentNavigationViewController(this, `${item.node.id}?entity=fair`)
  }

  render() {
    const { item } = this.props
    const boxWidth = Dimensions.get("window").width - 62 - space(4) - space(1)
    const fairImage = item.node.image ? item.node.image.url : null
    return (
      <Box py={2}>
        <TouchableWithoutFeedback onPress={() => this.handleTap(item)}>
          <Flex flexWrap="nowrap" flexDirection="row" alignItems="center">
            <RoundedImageWrapper>
              <OpaqueImageView height={58} width={58} imageURL={fairImage} />
            </RoundedImageWrapper>
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
              {item.node.exhibition_period && (
                <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
                  {item.node.exhibition_period}
                </Sans>
              )}
            </Box>
          </Flex>
        </TouchableWithoutFeedback>
      </Box>
    )
  }
}

const RoundedImageWrapper = styled(Box)`
  width: 58;
  border-radius: 30;
  overflow: hidden;
`
