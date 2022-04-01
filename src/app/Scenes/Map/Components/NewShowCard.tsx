import { themeGet } from "@styled-system/theme-get"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import { navigate } from "app/navigation/navigate"
import { TabFairItemRow } from "app/Scenes/City/Components/TabFairItemRow"
import { isEqual } from "lodash"
import { Box, ClassTheme, Text } from "palette"
import React, { Component } from "react"
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"
import { GalleryHit } from "../NewMap"
import { Fair, Show } from "../types"

const shadowDetails: any = {
  shadowRadius: 4,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
}

const Background = styled(Box)`
  background: ${themeGet("colors.white100")};
  height: 82;
  border-radius: 2px;
`

interface ShowCardProps {
  relay: RelayProp
  locations: GalleryHit[]
  onSaveStarted?: () => void
  onSaveEnded?: () => void
}

interface ShowCardState {
  currentPage: number
  isSaving: boolean
}

const PageIndicator = styled(Box)`
  height: ${themeGet("space.2")}px;
  border-radius: ${themeGet("space.1")}px;
  background: ${themeGet("colors.white100")};
  margin-left: 15px;
  margin-right: auto;
  margin-top: -15px;
`

export class NewShowCard extends Component<ShowCardProps, ShowCardState> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  list: FlatList<Show | Fair>

  state = {
    currentPage: 1,
    isSaving: false,
  }

  componentDidUpdate(prevProps: ShowCardProps) {
    // FIXME: Should this be slug?
    const previousIds = prevProps.locations.map((location) => location.id)
    const currentIds = this.props.locations.map((location) => location.id)
    const equal = isEqual(previousIds, currentIds)

    if (!this.state.isSaving && !equal && this.list) {
      setTimeout(() => {
        if (this.list) {
          this.list.scrollToOffset({ offset: 0, animated: true })
        }
      }, 500)
    }
  }

  // TODO: I left off here working my way down. if we want to try to make this work perhaps we can change the show|fair
  // references to GalleryHit and then update the GalleryHit type with values we can find on our search results.
  // It's possible this won't work.
  handleTap(item: GalleryHit) {
    if ("href" in item && item.href) {
      // Show
      navigate(item.href)
    } else {
      // Fair
      navigate(`/fair/${item.slug}`)
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  renderItem = ({ item }, noWidth = false) => {
    const props = noWidth ? { mr: 1 } : { width: this.cardWidth }

    return (
      <Background ml={1} p={1} style={shadowDetails} {...props}>
        <TouchableOpacity onPress={this.handleTap.bind(this, item)}>
          {item.type === "Show" ? (
            <ShowItemRow
              show={item}
              relay={this.props.relay}
              onSaveStarted={this.props.onSaveStarted}
              onSaveEnded={this.props.onSaveEnded}
              shouldHideSaveButton
            />
          ) : (
            <TabFairItemRow item={item} />
          )}
        </TouchableOpacity>
      </Background>
    )
  }

  onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPageNum = Math.round(e.nativeEvent.contentOffset.x / this.cardWidth + 1)

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
    const { locations: shows } = this.props
    const { currentPage } = this.state
    const hasOne = shows.length === 1
    const show = hasOne ? shows[0] : null

    return hasOne ? (
      show && this.renderItem({ item: show }, true)
    ) : (
      <ClassTheme>
        {({ space }) => (
          <>
            <PageIndicator style={shadowDetails} mx={1} px={0.5} my={0.5}>
              <Text
                variant="xs"
                weight="medium"
                px={0.5}
              >{`${currentPage} of ${shows.length}`}</Text>
            </PageIndicator>
            <FlatList
              ref={(c) => (this.list = c as any)}
              data={shows}
              style={{ marginHorizontal: "auto" }}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id}
              onScroll={this.onScroll}
              showsHorizontalScrollIndicator={false}
              snapToInterval={this.cardWidth + space(1)}
              contentContainerStyle={{
                paddingLeft: space(0.5),
                paddingRight: space(2) + space(0.3),
              }}
              scrollEventThrottle={299}
              directionalLockEnabled
              overScrollMode="always"
              snapToAlignment="start"
              decelerationRate="fast"
              horizontal
            />
          </>
        )}
      </ClassTheme>
    )
  }
}
