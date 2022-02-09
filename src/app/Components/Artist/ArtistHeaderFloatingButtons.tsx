import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistHeaderFloatingButtons_artist } from "__generated__/ArtistHeaderFloatingButtons_artist.graphql"
import { ArtistHeaderButton } from "app/Components/Artist/ArtistHeaderButton"
import { ShareSheet } from "app/Components/ShareSheet/ShareSheet"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { goBack } from "app/navigation/navigate"
import { ChevronIcon, ShareIcon } from "palette"
import React, { Fragment, useRef, useState } from "react"
import Animated, {
  and,
  block,
  call,
  Clock,
  cond,
  Easing,
  eq,
  neq,
  onChange,
  set,
  startClock,
  stopClock,
  timing,
  useCode,
} from "react-native-reanimated"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistHeaderFloatingButtonsProps {
  artist: ArtistHeaderFloatingButtons_artist
}

// Constants
const BACK_ICON_SIZE = 21
const SHARE_ICON_SIZE = 23
const ANIMATION_DURATION = 250
const BUTTON_OFFSET = 12

const runTiming = (clock: Clock, value: Animated.Value<number>) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
    frameTime: new Animated.Value(0),
  }

  const config = {
    duration: ANIMATION_DURATION,
    toValue: new Animated.Value(0),
    easing: Easing.inOut(Easing.ease),
  }

  return block([
    cond(and(eq(value, 1), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(value, 0), neq(config.toValue, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    // we run the step here that is going to update position
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    // we made the block return the updated position
    state.position,
  ])
}

export const ArtistHeaderFloatingButtons: React.FC<ArtistHeaderFloatingButtonsProps> = ({
  artist,
}) => {
  const [shareSheetVisible, setShareSheetVisible] = useState(false)
  const [hideButton, setHideButton] = useState(false)
  const { headerOffsetY } = useStickyTabPageContext()

  const clock = useRef(new Animated.Clock()).current
  const value = useRef(new Animated.Value(1)).current
  const opacity = useRef(runTiming(clock, value)).current
  const shouldHideButton = Animated.lessOrEq(headerOffsetY, -10)

  useCode(
    () =>
      block([
        cond(shouldHideButton, set(value, 0), set(value, 1)),
        onChange(
          shouldHideButton,
          call([shouldHideButton], ([shouldHide]) => {
            setHideButton(!!shouldHide)
          })
        ),
      ]),
    []
  )

  const handleSharePress = () => {
    setShareSheetVisible(true)
  }

  return (
    <Fragment>
      <ArtistHeaderButton
        shouldHide={hideButton}
        onPress={goBack}
        containerStyle={{ position: "absolute", top: BUTTON_OFFSET, left: BUTTON_OFFSET, opacity }}
      >
        <ChevronIcon direction="left" width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
      </ArtistHeaderButton>

      <ArtistHeaderButton
        shouldHide={hideButton}
        onPress={handleSharePress}
        containerStyle={{ position: "absolute", top: BUTTON_OFFSET, right: BUTTON_OFFSET, opacity }}
      >
        <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
      </ArtistHeaderButton>

      <ShareSheet
        entry={{
          internalID: artist.internalID,
          slug: artist.slug,
          href: artist.href!,
          artistNames: [artist.name!],
          imageURL: artist.image?.url ?? undefined,
        }}
        ownerType={OwnerType.artist}
        contextModule={ContextModule.artistHeader}
        visible={shareSheetVisible}
        setVisible={setShareSheetVisible}
      />
    </Fragment>
  )
}

export const ArtistHeaderFloatingButtonsFragmentContainer = createFragmentContainer(
  ArtistHeaderFloatingButtons,
  {
    artist: graphql`
      fragment ArtistHeaderFloatingButtons_artist on Artist {
        internalID
        slug
        href
        name
        image {
          url(version: "large")
        }
      }
    `,
  }
)
