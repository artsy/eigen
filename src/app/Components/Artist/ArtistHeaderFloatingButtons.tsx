import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistHeaderFloatingButtons_artist$data } from "__generated__/ArtistHeaderFloatingButtons_artist.graphql"
import { HeaderButton } from "app/Components/HeaderButton"
import { ShareSheet } from "app/Components/ShareSheet/ShareSheet"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { goBack } from "app/navigation/navigate"
import { ChevronIcon, ShareIcon } from "palette"
import React, { Fragment, useRef, useState } from "react"
import Animated, { block, call, cond, onChange, set, useCode } from "react-native-reanimated"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistHeaderFloatingButtonsProps {
  artist: ArtistHeaderFloatingButtons_artist$data
}

// Constants
const BACK_ICON_SIZE = 21
const SHARE_ICON_SIZE = 23
const BUTTON_OFFSET = 12

export const ArtistHeaderFloatingButtons: React.FC<ArtistHeaderFloatingButtonsProps> = ({
  artist,
}) => {
  const [shareSheetVisible, setShareSheetVisible] = useState(false)
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

  const handleSharePress = () => {
    setShareSheetVisible(true)
  }

  return (
    <Fragment>
      <HeaderButton
        shouldHide={hideButton}
        onPress={goBack}
        containerStyle={{ position: "absolute", top: BUTTON_OFFSET, left: BUTTON_OFFSET }}
      >
        <ChevronIcon direction="left" width={BACK_ICON_SIZE} height={BACK_ICON_SIZE} />
      </HeaderButton>

      <HeaderButton
        shouldHide={hideButton}
        onPress={handleSharePress}
        containerStyle={{ position: "absolute", top: BUTTON_OFFSET, right: BUTTON_OFFSET }}
      >
        <ShareIcon width={SHARE_ICON_SIZE} height={SHARE_ICON_SIZE} />
      </HeaderButton>

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
