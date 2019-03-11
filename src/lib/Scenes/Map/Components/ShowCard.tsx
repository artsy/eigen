import { Box, color, Sans, space } from "@artsy/palette"
import { ShowItemRow_show } from "__generated__/ShowItemRow_show.graphql"
import { ShowItemRow } from "lib/Components/Lists/ShowItemRow"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { TabFairItemRow } from "lib/Scenes/City/Components/TabFairItemRow"
import { isEqual } from "lodash"
import React, { Component } from "react"
import { Dimensions, FlatList, TouchableOpacity } from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { Fair, Show } from "../types"

const shadowDetails: any = {
  shadowRadius: 4,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
}

const Background = styled(Box)`
  background: ${color("white100")};
  height: 82;
  border-radius: 2px;
`

const screenWidth = Dimensions.get("window").width

interface ShowCardProps {
  relay: RelayProp
  shows: ShowItemRow_show[]
  onSaveStarted?: () => void
  onSaveEnded?: () => void
}

interface ShowCardState {
  currentPage: number
  isSaving: boolean
}

const PageIndicator = styled(Box)`
  height: ${space(2)}px;
  border-radius: ${space(1)}px;
  background: ${color("white100")};
  margin-left: 15px;
  margin-right: auto;
  margin-top: -15px;
`

export class ShowCard extends Component<ShowCardProps, ShowCardState> {
  list: FlatList<Show | Fair>

  state = {
    currentPage: 1,
    isSaving: false,
  }

  componentDidUpdate(prevProps) {
    if (!this.state.isSaving && !isEqual(prevProps, this.props) && this.list) {
      this.list.scrollToIndex({ index: 0, animated: true })
    }
  }

  handleTap(item) {
    const path = item.type === "Show" ? item.href : `${item.node.id}?entity=fair`
    SwitchBoard.presentNavigationViewController(this, path)
  }

  renderItem = ({ item }) => (
    <Background ml={1} p={1} style={shadowDetails} width={this.cardWidth}>
      <TouchableOpacity onPress={this.handleTap.bind(this, item)}>
        {item.type === "Show" ? (
          <ShowItemRow
            show={item}
            relay={this.props.relay}
            onSaveStarted={this.props.onSaveStarted}
            onSaveEnded={this.props.onSaveEnded}
            noPadding
          />
        ) : (
          <TabFairItemRow item={item} noPadding />
        )}
      </TouchableOpacity>
    </Background>
  )

  onScroll = e => {
    const newPageNum = Math.round(e.nativeEvent.contentOffset.x / screenWidth + 1)

    if (newPageNum !== this.state.currentPage) {
      this.setState({
        currentPage: newPageNum,
      })
    }
  }

  get scrollViewWidth() {
    return Math.round(Dimensions.get("window").width * 0.9)
  }

  get cardWidth() {
    return Dimensions.get("window").width - 40
  }

  onSaveStarted = () => {
    this.setState({
      isSaving: true,
    })

    if (this.props.onSaveStarted) {
      this.props.onSaveStarted()
    }
  }

  onSaveEnded = () => {
    this.setState({
      isSaving: false,
    })

    if (this.props.onSaveEnded) {
      this.props.onSaveEnded()
    }
  }

  render() {
    const { shows } = this.props
    const { currentPage } = this.state
    const hasOne = shows.length === 1
    const show = hasOne ? shows[0] : null

    return hasOne ? (
      show && this.renderItem({ item: show })
    ) : (
      <>
        <PageIndicator style={shadowDetails} mx={1} py={0.3} px={0.5} my={0.5}>
          <Sans size="1" weight="medium" px={0.5}>{`${currentPage} of ${shows.length}`}</Sans>
        </PageIndicator>
        <FlatList
          ref={c => (this.list = c as any)}
          data={shows}
          style={{ marginHorizontal: "auto" }}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          onScroll={this.onScroll}
          showsHorizontalScrollIndicator={false}
          snapToInterval={this.cardWidth + space(1) + 1}
          contentContainerStyle={{ padding: space(0.5) }}
          scrollEventThrottle={299}
          directionalLockEnabled={true}
          overScrollMode="always"
          snapToAlignment="start"
          decelerationRate="fast"
          horizontal
        />
      </>
    )
  }
}
