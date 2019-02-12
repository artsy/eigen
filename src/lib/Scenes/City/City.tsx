import { Box, color, Flex, Serif } from "@artsy/palette"
import React, { Component } from "react"
import { ScrollView } from "react-native"
import styled from "styled-components/native"
import { BucketKey, BucketResults } from "../Map/Bucket"
import { EventEmitter } from "../Map/EventEmitter"
import { Tab } from "../Map/types"
import { AllEvents } from "./Components/AllEvents"

interface Props {
  verticalMargin?: number
  isDrawerOpen?: boolean
}

interface State {
  buckets?: BucketResults
  filter: Tab
}

export class CityView extends Component<Props, State> {
  state = {
    buckets: null,
    filter: { id: "all", text: "All events" },
  }
  scrollViewVerticalStart = 0
  scrollView: ScrollView = null

  componentWillMount() {
    EventEmitter.subscribe("map:change", ({ filter, buckets }: { filter: Tab; buckets: BucketResults }) => {
      console.log(buckets)

      this.setState({
        buckets,
        filter,
      })
    })
  }

  componentDidUpdate() {
    if (!this.props.isDrawerOpen && this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true })
    }
  }

  render() {
    const { buckets, filter } = this.state
    const { isDrawerOpen, verticalMargin } = this.props
    // bottomInset is used for the ScrollView's contentInset. See the note in ARMapContainerViewController.m for context.
    const bottomInset = this.scrollViewVerticalStart + (verticalMargin || 0)
    return (
      buckets && (
        <Box>
          <Flex py={3} alignItems="center">
            <Handle />
          </Flex>
          <ScrollView
            contentInset={{ bottom: bottomInset }}
            onLayout={layout => (this.scrollViewVerticalStart = layout.nativeEvent.layout.y)}
            scrollEnabled={isDrawerOpen}
            ref={r => {
              if (r) {
                this.scrollView = r as any
              }
            }}
          >
            <Box px={3}>
              <Serif size="8" mb="3">
                {filter.id === "all" ? "All events" : filter.text}
              </Serif>
            </Box>
            {(() => {
              switch (filter && filter.id) {
                case "all":
                  return <AllEvents currentBucket={filter.id as BucketKey} buckets={buckets} />
                default:
                  return <Serif size="3">Not implemented yet.</Serif>
              }
            })()}
          </ScrollView>
        </Box>
      )
    )
  }
}

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${color("black30")};
`
