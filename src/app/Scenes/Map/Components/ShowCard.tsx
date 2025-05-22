import { Box, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import { TabFairItemRow } from "app/Scenes/City/Components/TabFairItemRow"
import { Fair, Show } from "app/Scenes/Map/types"
import { navigate } from "app/system/navigation/navigate"
import { isEqual } from "lodash"
import { Component } from "react"
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native"
import { RelayProp } from "react-relay"
import styled from "styled-components/native"

const shadowDetails: any = {
  shadowRadius: 4,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
}

const Background = styled(Box)`
  background: ${themeGet("colors.mono0")};
  height: 82px;
  border-radius: 2px;
`

interface ShowCardProps {
  relay: RelayProp
  shows: Array<Show | Fair>
  onSaveStarted?: () => void
  onSaveEnded?: () => void
}

interface ShowCardState {
  currentPage: number
  isSaving: boolean
}

const PageIndicator = styled(Box)`
  height: ${themeGet("space.2")};
  border-radius: ${themeGet("space.1")};
  background: ${themeGet("colors.mono0")};
  margin-left: 15px;
  margin-right: auto;
  margin-top: -15px;
`

export class ShowCard extends Component<ShowCardProps, ShowCardState> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  list: FlatList<Show | Fair>

  state = {
    currentPage: 1,
    isSaving: false,
  }

  componentDidUpdate(prevProps: ShowCardProps) {
    // FIXME: Should this be slug?
    const previousIds = prevProps.shows.map((show) => show.slug)
    const currentIds = this.props.shows.map((show) => show.slug)
    const equal = isEqual(previousIds, currentIds)

    if (!this.state.isSaving && !equal && this.list) {
      setTimeout(() => {
        if (this.list) {
          this.list.scrollToOffset({ offset: 0, animated: true })
        }
      }, 500)
    }
  }

  handleTap(item: Fair | Show) {
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
    const { shows } = this.props
    const { currentPage } = this.state
    const hasOne = shows.length === 1
    const show = hasOne ? shows[0] : null

    return hasOne ? (
      show && this.renderItem({ item: show }, true)
    ) : (
      <ThemeAwareClassTheme>
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
                paddingRight: space(2) + space(0.5),
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
      </ThemeAwareClassTheme>
    )
  }
}
