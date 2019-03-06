import { Box, color, space } from "@artsy/palette"
import { SavedShowItemRow_show } from "__generated__/SavedShowItemRow_show.graphql"
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
    <Background ml={1} px={2} style={shadowDetails} width={this.cardWidth}>
      <TouchableOpacity onPress={this.handleTap.bind(this, item)}>
        <SavedShowItemRow show={item} />
      </TouchableOpacity>
    </Background>
  )

  get cardWidth() {
    return Dimensions.get("window").width - 100
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
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={this.cardWidth + space(2)}
        contentContainerStyle={{ padding: space(1) }}
        overScrollMode="always"
        snapToAlignment="start"
        horizontal
      />
    )
  }
}
