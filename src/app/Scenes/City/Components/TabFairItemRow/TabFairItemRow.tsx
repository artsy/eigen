import { Flex, Box, Text } from "@artsy/palette-mobile"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Fair } from "app/utils/cityGuide/types"
import React from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"

const FAIR_IMAGE_SIZE = 58
const FAIR_IMAGE_BORDER_RADIUS = 30

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
                <Box
                  width={FAIR_IMAGE_SIZE}
                  borderRadius={FAIR_IMAGE_BORDER_RADIUS}
                  overflow="hidden"
                >
                  <ImageWithFallback
                    height={FAIR_IMAGE_SIZE}
                    width={FAIR_IMAGE_SIZE}
                    src={fairImage}
                  />
                </Box>
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
