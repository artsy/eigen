import { Box, Flex, Text } from "@artsy/palette-mobile"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import { CityGuideFairItemRow } from "app/Scenes/CityGuide/Components/CityGuideFairItemRow"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
// eslint-disable-next-line no-restricted-imports
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

const shadowDetails: any = {
  shadowRadius: 4,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
  elevation: 2,
}

const CARD_HEIGHT = 82
const CARD_BORDER_RADIUS = 2
const PAGE_INDICATOR_BORDER_RADIUS = 10
const PAGE_INDICATOR_OFFSET = 15

interface CityGuideShowCardProps {
  shows: Array<Show | Fair>
  onSaveStarted?: () => void
  onSaveEnded?: () => void
}

interface CityGuideShowCardState {
  currentPage: number
  isSaving: boolean
}

export class CityGuideShowCard extends Component<CityGuideShowCardProps, CityGuideShowCardState> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  list: FlatList<Show | Fair>

  state = {
    currentPage: 1,
    isSaving: false,
  }

  componentDidUpdate(prevProps: CityGuideShowCardProps) {
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
    const props: any = noWidth ? { mr: 1 } : { width: this.cardWidth }

    return (
      <Box
        ml={1}
        p={1}
        backgroundColor="mono0"
        height={CARD_HEIGHT}
        borderRadius={CARD_BORDER_RADIUS}
        style={shadowDetails}
        {...props}
      >
        <TouchableOpacity accessibilityRole="button" onPress={this.handleTap.bind(this, item)}>
          {item.type === "Show" ? (
            <ShowItemRow
              show={item}
              onSaveStarted={this.props.onSaveStarted}
              onSaveEnded={this.props.onSaveEnded}
              shouldHideSaveButton
            />
          ) : (
            <CityGuideFairItemRow item={item} />
          )}
        </TouchableOpacity>
      </Box>
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
          <Flex>
            <Box
              borderRadius={PAGE_INDICATOR_BORDER_RADIUS}
              backgroundColor="mono0"
              style={{
                ...shadowDetails,
                marginLeft: PAGE_INDICATOR_OFFSET,
                marginRight: "auto",
                marginTop: -PAGE_INDICATOR_OFFSET,
              }}
              mx={1}
              px={0.5}
              my={0.5}
            >
              <Text
                variant="xs"
                weight="medium"
                px={0.5}
              >{`${currentPage} of ${shows.length}`}</Text>
            </Box>
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
          </Flex>
        )}
      </ThemeAwareClassTheme>
    )
  }
}
