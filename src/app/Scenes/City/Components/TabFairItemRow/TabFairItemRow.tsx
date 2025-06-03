import { Flex, Box, Text } from "@artsy/palette-mobile"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { Fair } from "app/Scenes/Map/types"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export interface Props {
  item: Fair
}

export class TabFairItemRow extends React.Component<Props> {
  handleTap = (item: Fair) => {
    navigate(`/fair/${item.slug}`)
  }

  render() {
    const { item } = this.props
    const fairImage = item.image ? item.image.url : null
    return (
      <ThemeAwareClassTheme>
        {({ space }) => {
          const boxWidth = Dimensions.get("window").width - 62 - space(4) - space(1)
          return (
            <TouchableWithoutFeedback
              accessibilityRole="button"
              onPress={() => this.handleTap(item)}
            >
              <Flex flexWrap="nowrap" flexDirection="row" alignItems="center" mr={1}>
                <RoundedImageWrapper>
                  <ImageWithFallback height={58} width={58} src={fairImage} />
                </RoundedImageWrapper>
                <Box width={boxWidth} pl={1}>
                  {!!item.name && (
                    <Text variant="sm" weight="medium" numberOfLines={1} ellipsizeMode="tail">
                      {item.name}
                    </Text>
                  )}
                  {!!item.counts && !!item.counts.partners && (
                    <Text variant="sm" color="mono60" numberOfLines={1} ellipsizeMode="tail">
                      {item.counts.partners > 1
                        ? `${item.counts.partners} Exhibitors`
                        : `${item.counts.partners} Exhibitor`}
                    </Text>
                  )}
                  {!!item.exhibition_period && (
                    <Text variant="sm" color="mono60" numberOfLines={1} ellipsizeMode="tail">
                      {item.exhibition_period}
                    </Text>
                  )}
                </Box>
              </Flex>
            </TouchableWithoutFeedback>
          )
        }}
      </ThemeAwareClassTheme>
    )
  }
}

const RoundedImageWrapper = styled(Box)`
  width: 58px;
  border-radius: 30px;
  overflow: hidden;
`
