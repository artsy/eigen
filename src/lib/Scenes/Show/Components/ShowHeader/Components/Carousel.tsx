import { Box, Flex, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React from "react"
import { Dimensions, ScrollView, ScrollViewProperties } from "react-native"
import styled from "styled-components/native"

const ITEM_HEIGHT = 350

const { width: windowWidth } = Dimensions.get("window")

const ImageView = styled(OpaqueImageView)<{ isFirst: boolean; aspectRatio: number }>`
  height: ${ITEM_HEIGHT};
  margin-top: ${p => (p.isFirst ? 150 : 0)};
  ${p =>
    p.isFirst &&
    `
      height: 200;
      width: ${windowWidth - space(2) - 80};
    `};
`

const PageList = styled(ScrollView)`
  height: ${ITEM_HEIGHT}px;
  padding-left: ${space(2)};
`

interface Props extends ScrollViewProperties {
  sources: Array<{
    imageURL: string
    aspectRatio: number
  }>
}

export class Carousel extends React.Component<Props> {
  scrollView: ScrollView

  keyForSource = ({ imageURL }) => imageURL

  renderItems = () => {
    const { sources } = this.props

    return sources.map((source, i) => {
      const lastImage = i === sources.length - 1
      return (
        <Flex
          key={this.keyForSource(source)}
          mr={lastImage ? 2 : 1}
          pr={lastImage ? 2 : 0}
          alignItems="flex-start"
        >
          <ImageView {...source} isFirst={i === 0} />
        </Flex>
      )
    }
  }

  render() {
    return (
      <Box my={2}>
        <PageList
          {...this.props}
          innerRef={ref => {
            this.scrollView = ref
          }}
          horizontal
          scrollEventThrottle={160}
          showsHorizontalScrollIndicator={false}
        >
          {this.renderItems()}
        </PageList>
      </Box>
    )
  }
}
