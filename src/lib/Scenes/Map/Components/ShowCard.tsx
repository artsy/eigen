import { Box, color } from "@artsy/palette"
import { SavedShowItemRow_show } from "__generated__/SavedShowItemRow_show.graphql"
import { space } from "lib/Components/Bidding/Elements/types"
import { SavedShowItemRow } from "lib/Components/Lists/SavedShowItemRow"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import { Dimensions, FlatList, TouchableOpacity } from "react-native"
import styled from "styled-components/native"

const shadowDetails: any = {
  shadowRadius: 4,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
}

const Background = styled(Box)`
  background: ${color("white100")};
  height: 106;
  border-radius: 2px;
`

const screenWidth = Dimensions.get("window").width
const scrollViewWidth = Math.round(screenWidth * 0.9)
const cardWidth = scrollViewWidth * 0.8
const paddingCard = scrollViewWidth * 0.02
const scrollViewPadding = scrollViewWidth * 0.08

interface ShowCardProps {
  shows: SavedShowItemRow_show[]
  onSave?: () => void
}

export class ShowCard extends Component<ShowCardProps> {
  handleTap(show) {
    const path = show.href
    SwitchBoard.presentNavigationViewController(this, path)

    if (this.props.onSave) {
      this.props.onSave()
    }
  }

  renderItem = ({ item }) => (
    <Background mx={paddingCard} px={2} style={shadowDetails} width={cardWidth}>
      <TouchableOpacity onPress={this.handleTap.bind(this, item)}>
        <SavedShowItemRow show={item} />
      </TouchableOpacity>
    </Background>
  )

  get scrollViewWidth() {
    return Math.round(Dimensions.get("window").width * 0.9)
  }

  get cardWidth() {
    return Dimensions.get("window").width * 0.8
  }

  render() {
    const { shows } = this.props
    const hasOne = shows.length === 1
    const show = hasOne && shows[0]

    return hasOne ? (
      show && (
        <Background m={1} px={2} style={shadowDetails}>
          <TouchableOpacity onPress={this.handleTap.bind(this)}>
            <SavedShowItemRow show={show} />
          </TouchableOpacity>
        </Background>
      )
    ) : (
      <FlatList
        data={shows}
        style={{ marginHorizontal: "auto" }}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 2 * paddingCard + 1}
        contentContainerStyle={{ padding: space(1) }}
        scrollEventThrottle={299}
        directionalLockEnabled={true}
        overScrollMode="always"
        snapToAlignment="start"
        decelerationRate="fast"
        horizontal
      />
    )
  }
}
