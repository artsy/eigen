import { Box, Flex, Sans, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Fair } from "lib/Scenes/Map/types"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export interface Props {
  item: Fair
}

export class TabFairItemRow extends React.Component<Props> {
  handleTap = (item: Fair) => {
    SwitchBoard.presentNavigationViewController(this, `${item.id}?entity=fair`)
  }

  render() {
    const { item } = this.props
    const boxWidth = Dimensions.get("window").width - 62 - space(4) - space(1)
    const fairImage = item.image ? item.image.url : null
    return (
      <Box py={2}>
        <TouchableWithoutFeedback onPress={() => this.handleTap(item)}>
          <Flex flexWrap="nowrap" flexDirection="row" alignItems="center" mr={10}>
            <RoundedImageWrapper>
              <OpaqueImageView height={58} width={58} imageURL={fairImage} />
            </RoundedImageWrapper>
            <Box width={boxWidth} pl={1}>
              {item.name && (
                <Sans weight="medium" size="3t" numberOfLines={1} ellipsizeMode="tail">
                  {item.name}
                </Sans>
              )}
              {item.counts &&
                item.counts.partners && (
                  <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
                    {item.counts.partners > 1
                      ? `${item.counts.partners} Exhibitors`
                      : `${item.counts.partners} Exhibitor`}
                  </Sans>
                )}
              {item.exhibition_period && (
                <Sans size="3t" color="black60" numberOfLines={1} ellipsizeMode="tail">
                  {item.exhibition_period}
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
