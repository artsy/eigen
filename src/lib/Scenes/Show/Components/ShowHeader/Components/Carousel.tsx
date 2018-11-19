import { Box, Flex } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React from "react"
import { ScrollView } from "react-native"
import styled from "styled-components/native"

const ITEM_HEIGHT = 350

const ImageView = styled(OpaqueImageView)`
  height: ${ITEM_HEIGHT}px;
`

const PageList = styled(ScrollView)`
  height: ${ITEM_HEIGHT}px;
`

interface Props {
  sources: Array<{
    imageURL: string
    aspectRatio: number
  }>
}

interface State {
  pageWidth: number
  activePageIdx: number
  animationTargetIdx: number
}

export class Carousel extends React.Component<Props, State> {
  scrollView: ScrollView

  keyForSource = ({ imageURL }) => imageURL

  renderItems = () => {
    const { sources } = this.props

    return sources.map(source => (
      <Flex key={this.keyForSource(source)} mr={1}>
        <ImageView {...source} />
      </Flex>
    ))
  }

  render() {
    return (
      <Box my={2} ml={2}>
        <PageList
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
