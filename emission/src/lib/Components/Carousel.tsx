import { Box, color, Flex } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { LayoutChangeEvent, ScrollView, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

// Hardcoded height from Show carousel:
// https://github.com/artsy/eigen/blob/1526f4dad04742be19ed2fb219f94d0512734326/Artsy/View_Controllers/Fair/ARShowViewController.m#L90
const ITEM_HEIGHT = 250

const ImageView = styled(OpaqueImageView)`
  height: ${ITEM_HEIGHT}px;
`

const PageList = styled(ScrollView)`
  height: ${ITEM_HEIGHT}px;
`

const PageIndicator = styled.View<{ isActive: boolean; isLast: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ isActive }) => (isActive ? color("black100") : color("black10"))};
  margin-right: ${({ isLast }) => (isLast ? 0 : 12)}px;
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
  state = {
    activePageIdx: 0,
    animationTargetIdx: null,
    pageWidth: null,
  }

  handleScroll = ev => {
    const {
      nativeEvent: {
        contentOffset: { x },
      },
    } = ev
    const { pageWidth, animationTargetIdx } = this.state
    const currentPageIdx = Math.round(x <= 0 ? 0 : x / pageWidth)
    if (animationTargetIdx !== null) {
      // Clear indicator "lock" if we've reached our destination, otherwise
      // ignore events triggered by intermediate animated pages.
      if (animationTargetIdx === currentPageIdx) {
        this.setState({ animationTargetIdx: null })
      }
    } else {
      this.setState({
        activePageIdx: currentPageIdx,
      })
    }
  }

  handleLayout = (ev: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { width },
      },
    } = ev
    if (width && !this.state.pageWidth) {
      this.setState({ pageWidth: width })
    }
  }

  handleIndicatorPress = idx => {
    const { pageWidth } = this.state
    if (this.scrollView) {
      this.setState(
        {
          animationTargetIdx: idx,
          activePageIdx: idx,
        },
        () => {
          this.scrollView.scrollTo({
            x: idx * pageWidth,
            y: 0,
            animated: true,
          })
        }
      )
    }
  }

  keyForSource = ({ imageURL }) => imageURL

  renderItems = () => {
    const { pageWidth } = this.state
    const { sources } = this.props

    if (pageWidth) {
      return sources.map(source => (
        <Flex key={this.keyForSource(source)} width={pageWidth} justifyContent="center" alignItems="center">
          <ImageView {...source} />
        </Flex>
      ))
    }

    // If we're awaiting first layout, render an item with height to prevent vertical reflow jank.
    return <Box height={ITEM_HEIGHT} />
  }

  render() {
    const { sources } = this.props
    const { activePageIdx } = this.state
    return (
      <>
        <PageList
          ref={ref => {
            this.scrollView = ref
          }}
          onLayout={this.handleLayout}
          pagingEnabled
          horizontal
          onScroll={this.handleScroll}
          scrollEventThrottle={160}
          showsHorizontalScrollIndicator={false}
        >
          {this.renderItems()}
        </PageList>
        <Flex flexDirection="row" mt={1} mb={1} justifyContent="center" alignItems="center">
          {sources.map((source, idx) => (
            <TouchableWithoutFeedback key={this.keyForSource(source)} onPress={() => this.handleIndicatorPress(idx)}>
              <PageIndicator isActive={idx === activePageIdx} isLast={idx === sources.length - 1} />
            </TouchableWithoutFeedback>
          ))}
        </Flex>
      </>
    )
  }
}
