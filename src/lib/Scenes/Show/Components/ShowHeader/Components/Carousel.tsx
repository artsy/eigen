import { Box, Flex, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { Dimensions, ScrollView, ScrollViewProperties } from "react-native"
import styled from "styled-components/native"

interface Props extends ScrollViewProperties {
  sources: Array<{
    imageURL: string
    aspectRatio: number
  }>
}

export class Carousel extends React.Component<Props> {
  // @ts-ignore STRICTNESS_MIGRATION
  scrollView: ScrollView

  // @ts-ignore STRICTNESS_MIGRATION
  keyForSource = ({ imageURL }) => imageURL

  renderItems = () => {
    const { sources } = this.props

    return sources.map((source, i) => {
      const lastImage = i === sources.length - 1
      return (
        <Flex key={this.keyForSource(source)} mr={lastImage ? 2 : 1} pr={lastImage ? 2 : 0} alignItems="flex-start">
          <ImageView {...source} isFirst={i === 0} />
        </Flex>
      )
    })
  }

  render() {
    return (
      <Box my={2}>
        <PageList
          {...this.props}
          ref={ref => {
            // @ts-ignore STRICTNESS_MIGRATION
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

const ITEM_HEIGHT = 350

const { width: windowWidth } = Dimensions.get("window")

const ImageView = styled(OpaqueImageView)<{ isFirst: boolean; aspectRatio: number }>`
  height: ${ITEM_HEIGHT};
  margin-top: ${(p: any /* STRICTNESS_MIGRATION */) => (p.isFirst ? 150 : 0)};
  ${(p: any /* STRICTNESS_MIGRATION */) =>
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
