import { ArtistHeaderFloatingButtons_artist$data } from "__generated__/ArtistHeaderFloatingButtons_artist.graphql"
import { HeaderButton } from "app/Components/HeaderButton"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { goBack } from "app/navigation/navigate"
import { ChevronIcon, ShareIcon } from "palette"
import React, { useRef, useState } from "react"
import Animated, { block, call, cond, onChange, set, useCode } from "react-native-reanimated"
import { createFragmentContainer, graphql } from "react-relay"
import { useCustomShareSheet } from "../CustomShareSheet/atoms"

interface ArtistHeaderFloatingButtonsProps {
  artist: ArtistHeaderFloatingButtons_artist$data
}

// Constants
const BACK_ICON_SIZE = 21
const SHARE_ICON_SIZE = 23

export const ArtistHeaderFloatingButtons: React.FC<ArtistHeaderFloatingButtonsProps> = ({
  artist,
}) => {
  const sharesheet = useCustomShareSheet()
  const [hideButton, setHideButton] = useState(false)
  const { headerOffsetY } = useStickyTabPageContext()

  const value = useRef(new Animated.Value(1)).current
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

  return (
    <>
      <HeaderButton
        shouldHide={hideButton}
        position="left"
        onPress={goBack}
        applySafeAreaTopInsets={false}
      >
        <ChevronIcon direction="left" width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
      </HeaderButton>

      <HeaderButton
        shouldHide={hideButton}
        onPress={() =>
          sharesheet.show({
            type: "artist",
            slug: artist.slug,
          })
        }
        position="right"
        applySafeAreaTopInsets={false}
      >
        <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
      </HeaderButton>
    </>
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
